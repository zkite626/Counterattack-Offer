import { Module } from '@nestjs/common';
import { SecretCryptoService } from '../../common/security/secret-crypto.service';
import { SecretService } from '../../common/security/secret.service';
import { AuthModule } from '../auth/auth.module';
import { ModelConfigController } from './model-config.controller';
import { ModelConfigService } from './model-config.service';

@Module({
  imports: [AuthModule],
  controllers: [ModelConfigController],
  providers: [ModelConfigService, SecretCryptoService, SecretService],
  exports: [ModelConfigService],
})
export class ModelConfigModule {}
