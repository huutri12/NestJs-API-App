import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/modules/guard/RolesGuard';
import { JwtAuthGuard } from 'src/modules/guard/JwtAuthGuard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route thêm user mới
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // Route lấy tất cả users
  @Roles(Role.ADMIN)
  @Get('all')
  @UseGuards(RolesGuard, JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // Route lấy user theo ID
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  // Route cập nhật user
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.userService.updateUser(+id, updateUserDto);
  }

  // softDelete user
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    await this.userService.softDeleteUser(+id);
    return `User with ID ${id} has been soft deleted`;
  }

  // restore user
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  async restore(@Param('id') id: number): Promise<string> {
    await this.userService.restoreUser(id);
    return `User with ID ${id} has been restored`;
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getActiveUsers(): Promise<any> {
    return this.userService.getActiveUsers();
  }
}
