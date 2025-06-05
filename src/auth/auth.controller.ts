import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiBearerAuth()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Xác thực OTP để kích hoạt tài khoản' })
  @ApiResponse({ status: 200, description: 'Kích hoạt thành công' })
  @ApiResponse({ status: 400, description: 'OTP không hợp lệ hoặc đã hết hạn' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }
}
