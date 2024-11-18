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
import { JwtAuthGuard } from '../../guard/JwtAuthGuard';
import { Public, Roles } from 'src/common/decorator/customize';
import { Role } from 'src/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@Roles(Role.ADMIN)
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return { message: 'Registration successful' };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    const tokens = await this.authService.login(loginUserDto);
    return { message: 'Login successful', ...tokens };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    console.log(refreshToken);
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { message: 'Token refreshed', accessToken };
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logout successful' };
  }
}
