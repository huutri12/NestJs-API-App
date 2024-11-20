import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
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
    const userInDb = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userInDb) {
      throw new HttpException('User đã tồn tại', HttpStatus.BAD_REQUEST);
    }
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: email },
    });
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

  // List User after soft delete
  async getActiveUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  //List All user (done softDeleteUser)
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ withDeleted: true });
  }

  //Paginate User, Search User
  async getPaginatedUsersWithSearch(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be greater than or equal to 1');
    }
    const whereCondition = search
      ? [
          { username: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
          { fullName: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    // Trả về kết quả
    return {
      data,
      total,
      page,
      limit,
    };
  }
}
