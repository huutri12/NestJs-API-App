import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class LoginUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Email không hợp lệ, vui lòng nhập một địa chỉ email hợp lệ',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Tối thiểu tám ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt',
  })
  password: string;

}
