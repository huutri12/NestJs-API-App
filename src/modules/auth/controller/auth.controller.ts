import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginUserDto } from '../../users/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return { message: 'Login successful', accessToken: user.accessToken };
  }

  // Endpoint cho người dùng đăng nhập
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authService.login(loginUserDto);
    return { message: 'Login successful', ...tokens };
  }

  // Endpoint để làm mới Access Token bằng Refresh Token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { message: 'Token refreshed', accessToken };
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  async getProfile(@Req() req: any) {
    // req.user sẽ chứa thông tin người dùng từ payload của JWT
    return req.user;
  }

  // Endpoint đăng xuất người dùng (tùy chọn, không bắt buộc nếu không lưu refresh token trong database)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // Nếu không lưu refresh token, có thể đơn giản trả về message
    return { message: 'Logout successful' };
  }
}
