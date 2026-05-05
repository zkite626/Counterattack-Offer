import { Module } from '@nestjs/common';
import { SecretCryptoService } from './secret-crypto.service';
import { SecretService } from './secret.service';

@Module({
  providers: [SecretCryptoService, SecretService],
  exports: [SecretCryptoService, SecretService],
})
export class SecurityModule {}
