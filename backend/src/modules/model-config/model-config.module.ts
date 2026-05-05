import { Module } from '@nestjs/common';
import { SecretCryptoService } from '../../common/security/secret-crypto.service';
import { SecretService } from '../../common/security/secret.service';
import { ModelConfigController } from './model-config.controller';
import { ModelConfigService } from './model-config.service';

@Module({
  controllers: [ModelConfigController],
  providers: [ModelConfigService, SecretCryptoService, SecretService],
  exports: [ModelConfigService],
})
export class ModelConfigModule {}
