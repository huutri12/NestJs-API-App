import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/constans/regex.constants';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  @Matches(REGEX.EMAIL, {
    message: 'Email không hợp lệ, vui lòng nhập một địa chỉ email hợp lệ',
  })
  email: string;
}
