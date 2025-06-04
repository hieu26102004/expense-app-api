import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email hợp lệ' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongpassword', minLength: 6, description: 'Mật khẩu tối thiểu 6 ký tự' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người dùng' })
  @IsNotEmpty()
  name: string;
}