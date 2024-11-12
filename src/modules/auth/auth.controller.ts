import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post('refresh')
  async refresh(@Body() body) {
    return await this.authService.refresh(body.refreshToken);
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  async logout(@Req() req: any) {
    await this.authService.logout(req.user);
    return {
      statusCode: 200,
    };
  }
}
