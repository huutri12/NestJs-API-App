import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email: email },
    });
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
