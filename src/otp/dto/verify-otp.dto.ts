import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Email của người dùng' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mã OTP' })
  @IsNotEmpty()
  code: string;
}
