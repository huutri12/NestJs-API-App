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
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/JwtAuthGuard';
import { Roles } from 'src/common/decorator/customize';
import { Role } from 'src/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route thêm user mới
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // Route lấy tất cả users
  @Get('protected')
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Request() req): Promise<User[]> {
    console.log('User:', req.user);
    return this.userService.findAll();
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

  // Route xóa user
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }
}
