import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginUserDto } from '../../users/dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../users/service/user.service';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      accessToken: this.createAccessToken(user),
    };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.validateUserCredentials(email, password);
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const { email, sub: userId } = this.verifyRefreshToken(refreshToken);
      return this.createAccessToken({ id: userId, email });
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  // Kiểm tra thông tin đăng nhập của người dùng
  private async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.findUserByEmail(email);
    await this.verifyPassword(password, user.password);
    return user;
  }

  // Tìm người dùng bằng email, ném lỗi nếu không tìm thấy
  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    return user;
  }

  // Kiểm tra mật khẩu người dùng
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordValid)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  // Tạo Access Token
  private createAccessToken(user: { id: number; email: string }): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  // Tạo Refresh Token
  private createRefreshToken(user: { id: number; email: string }): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  // Kiểm tra Refresh Token và trả về payload nếu hợp lệ
  private verifyRefreshToken(refreshToken: string): any {
    return this.jwtService.verify(refreshToken);
  }
}
