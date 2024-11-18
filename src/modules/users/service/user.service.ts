import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // add user
  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    // Kiểm tra xem người dùng đã tồn tại trong DB hay chưa
    const userInDb = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userInDb) {
      throw new HttpException('User đã tồn tại', HttpStatus.BAD_REQUEST);
    }

    // Tạo user mới và lưu vào DB
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      fullName: createUserDto.fullName,
      role: createUserDto.role || Role.USER,
    });

    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
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

  //xoa mem
  async softDeleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User không tồn tại', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.softDelete(id);
  }

  //restore user
  async restoreUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) {
      throw new HttpException('User không tồn tại', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.restore(id);
  }

  // List User have not xóa mềm
  async getActiveUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  //lay tat ca user (done softDeleteUser)
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ withDeleted: true });
  }
}
