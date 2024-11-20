import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { REGEX } from 'src/common/constans/regex.constants';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'UserName không được để trống' })
  username: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @Matches(REGEX.EMAIL, {
    message: 'Email không hợp lệ, vui lòng nhập một địa chỉ email hợp lệ',
  })
  email: string;

  
  @ApiProperty()
  @IsString()
  fullName: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  @Matches(REGEX.PASSWORD, {
    message:
      'Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt',
  })
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER;
}
