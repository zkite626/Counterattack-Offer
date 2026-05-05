import { Module } from '@nestjs/common';
import { SecretCryptoService } from '../../common/security/secret-crypto.service';
import { MailService } from './mail.service';

@Module({
  providers: [MailService, SecretCryptoService],
  exports: [MailService, SecretCryptoService],
})
export class MailModule {}
