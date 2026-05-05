import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DatabaseBootstrapService } from './database-bootstrap.service';

@Module({
  imports: [PrismaModule],
  providers: [DatabaseBootstrapService],
})
export class BootstrapModule {}
