import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/constans/regex.constants';

export class LoginUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @Matches(REGEX.EMAIL, {
    message: 'Email không hợp lệ, vui lòng nhập một địa chỉ email hợp lệ',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password không được để trống' })
  @Matches(REGEX.PASSWORD, {
    message:
      'Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt',
  })
  password: string;
}
