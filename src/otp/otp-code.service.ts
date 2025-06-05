import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpCode } from './otp-code.entity';
import { MailService } from '../mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpCodeService {
  constructor(
    @InjectRepository(OtpCode)
    private otpRepo: Repository<OtpCode>,
    private mailService: MailService,
  ) {}

  async generateAndSendOtp(dto: { email: string }): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const otp = this.otpRepo.create({ email: dto.email, code, expiresAt });
    try {
      await this.otpRepo.save(otp);
      console.log('OTP saved to DB:', otp);
    } catch (error) {
      console.error('Error saving OTP to DB:', error);
    }
    await this.mailService.sendMail(
      dto.email,
      'Your OTP Code',
      `Your OTP code is: ${code}. It will expire in 10 minutes.`
    );
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<boolean> {
    const otp = await this.otpRepo.findOne({ where: { email: dto.email, code: dto.code } });
    if (!otp || otp.expiresAt < new Date()) return false;
    await this.otpRepo.delete({ id: otp.id });
    return true;
  }
}
