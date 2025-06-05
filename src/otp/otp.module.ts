import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpCode } from './otp-code.entity';
import { OtpCodeService } from './otp-code.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpCode]), MailModule],
  providers: [OtpCodeService],
  exports: [OtpCodeService],
})
export class OtpModule {} 