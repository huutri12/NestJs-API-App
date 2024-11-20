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
    await this.userService.create(createUserDto);
    return {
      message: 'Đăng ký thành công, vui lòng đăng nhập để tiếp tục.',
    };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.validateUserCredentials(email, password);
    return {
      user: { id: user.id, email: user.email },
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const { sub: userId } = this.verifyRefreshToken(refreshToken);
      const user = await this.userService.findOne(userId);

      if (!user) {
        throw new HttpException(
          'Người dùng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        accessToken: this.createAccessToken(user),
        refreshToken: this.createRefreshToken(user),
      };
    } catch (error) {
      throw new HttpException(
        'Refresh token không hợp lệ',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.findUserByEmail(email);
    await this.verifyPassword(password, user.password);
    return user;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Thông tin đăng nhập không chính xác',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // Hàm tạo token với thời gian hết hạn tùy chỉnh
  private createToken(
    user: { id: number; email: string },
    expiresIn: string,
    secret: string,
  ): string {
    const payload = {
      email: user.email,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
      algorithm: 'HS256',
    });
  }

  private createAccessToken(user: { id: number; email: string }): string {
    return this.createToken(user, '30m', process.env.SECRETKEY);
  }

  private createRefreshToken(user: { id: number; email: string }): string {
    return this.createToken(user, '7d', process.env.SECRETKEY_REFRESH);
  }

  private verifyRefreshToken(refreshToken: string): any {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: process.env.SECRETKEY_REFRESH,
      });
    } catch (error) {
      throw new HttpException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
