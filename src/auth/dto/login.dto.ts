import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'hieu7a3thcsbt@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'hieu' })
  @IsNotEmpty()
  password: string;
}
