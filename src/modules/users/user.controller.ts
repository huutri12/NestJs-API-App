import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route thêm user mới
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }

  // Route lấy tất cả users
  @Get()
  findAll(): Promise<User[]> {
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
