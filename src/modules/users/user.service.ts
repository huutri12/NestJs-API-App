import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { Hash, hash } from 'crypto';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // add user
  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 8);

    // check the user exists
    const userInDb = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userInDb) {
      throw new HttpException('User đã tồn tại', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create(createUserDto);

    // Save users to the database
    return await this.userRepository.save(newUser);
  }

  async findByLogin({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // use bcrypt.compare check pass
    const is_equal = await bcrypt.compare(password, user.password);

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findByEmail(email) {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  async update(filter, update) {
    if (update.refreshToken) {
      update.refreshToken = await bcrypt.hash(
        this.reverse(update.refreshToken),
        10,
      );
    }
    return await this.userRepository.update(filter, update);
  }

  private reverse(s: string): string {
    return s.split('').reverse().join('');
  }

  async getUserByRefresh(refresh_token, email) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = await bcrypt.compare(
      this.reverse(refresh_token),
      user.refreshToken,
    );

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  // get all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // get user in ID
  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // update user
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, updateUserDto);
  }

  // delete user
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
