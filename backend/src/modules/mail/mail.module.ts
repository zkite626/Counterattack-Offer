import { Module } from '@nestjs/common';
import { SecurityModule } from '../../common/security/security.module';
import { MailService } from './mail.service';

@Module({
  imports: [SecurityModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
