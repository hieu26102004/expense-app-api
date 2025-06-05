import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { OtpCodeService } from '../otp/otp-code.service';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpCodeService: OtpCodeService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      isActive: false,
    });

    await this.otpCodeService.generateAndSendOtp({ email: user.email });

    return { message: 'OTP đã được gửi tới email. Vui lòng xác thực để kích hoạt tài khoản.' };
  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
  async verifyOtp(dto: VerifyOtpDto) {
    const isValid = await this.otpCodeService.verifyOtp(dto);
    if (!isValid) {
      return { success: false, message: 'OTP không hợp lệ hoặc đã hết hạn.' };
    }
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { success: false, message: 'Không tìm thấy người dùng.' };
    }
    user.isActive = true;
    await this.usersService.update(user);
    return { success: true, message: 'Kích hoạt tài khoản thành công.' };
  }
}
