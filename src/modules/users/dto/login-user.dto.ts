import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/constans/regex.constants';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @Matches(REGEX.EMAIL, {
    message: 'Email không hợp lệ, vui lòng nhập một địa chỉ email hợp lệ',
  })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Password không được để trống' })
  @Matches(REGEX.PASSWORD, {
    message:
      'Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt',
  })
  password: string;
}
