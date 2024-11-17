import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginUserDto } from '../../users/dto/login-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../users/service/user.service';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly secretKey = process.env.SECRETKEY;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Đăng ký người dùng mới
  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      message: 'Đăng ký thành công, vui lòng đăng nhập để tiếp tục.',
    };
  }

  // Đăng nhập và trả về accessToken và refreshToken
  async login({ email, password }: LoginUserDto) {
    const user = await this.validateUserCredentials(email, password);
    return {
      user: { id: user.id, email: user.email },
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  // Làm mới accessToken từ refreshToken
  async refreshAccessToken(refreshToken: string) {
    try {
      const { email, sub: userId } = this.verifyRefreshToken(refreshToken);
      const user = await this.userService.findOne(userId); // Tìm người dùng
      if (!user) {
        throw new HttpException(
          'Người dùng không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        accessToken: this.createAccessToken(user),
        refreshToken: this.createRefreshToken(user), // Cấp lại refresh token nếu cần
      };
    } catch (error) {
      throw new HttpException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
        HttpStatus.UNAUTHORIZED,
      );
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

  // Tìm người dùng theo email, nếu không tìm thấy thì ném lỗi
  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // Kiểm tra mật khẩu của người dùng
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
  ): string {
    const payload = {
      email: user.email,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000), // Thời gian phát hành token
    };

    return this.jwtService.sign(payload, {
      secret: this.secretKey,
      expiresIn,
      algorithm: 'HS256',
    });
  }

  // Tạo Access Token với thời gian hết hạn 15 phút
  private createAccessToken(user: { id: number; email: string }): string {
    return this.createToken(user, '15m');
  }

  // Tạo Refresh Token với thời gian hết hạn 7 ngày
  private createRefreshToken(user: { id: number; email: string }): string {
    return this.createToken(user, '7d');
  }

  // Kiểm tra tính hợp lệ của Refresh Token và trả về payload nếu hợp lệ
  private verifyRefreshToken(refreshToken: string): any {
    try {
      return this.jwtService.verify(refreshToken, { secret: this.secretKey });
    } catch (error) {
      throw new HttpException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
