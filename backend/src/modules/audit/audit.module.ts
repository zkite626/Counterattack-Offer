import { Module } from '@nestjs/common';
import { SecurityModule } from '../../common/security/security.module';
import { AuditService } from './audit.service';

@Module({
  imports: [SecurityModule],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
