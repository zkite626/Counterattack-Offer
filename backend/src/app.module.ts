import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { RateLimitModule } from './common/rate-limit/rate-limit.module';
import { SecurityModule } from './common/security/security.module';
import { validateEnvironment } from './config/environment';
import { PrismaModule } from './prisma/prisma.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { CareerFlowModule } from './modules/career-flow/career-flow.module';
import { HealthModule } from './modules/health/health.module';
import { MailModule } from './modules/mail/mail.module';
import { ModelConfigModule } from './modules/model-config/model-config.module';
import { ResumeModule } from './modules/resume/resume.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnvironment,
    }),
    SecurityModule,
    RateLimitModule,
    PrismaModule,
    BootstrapModule,
    HealthModule,
    AuthModule,
    UsersModule,
    AiModule,
    ModelConfigModule,
    CareerFlowModule,
    ResumeModule,
    MailModule,
    AdminModule,
    AuditModule,
  ],
  providers: [GlobalExceptionFilter, RequestIdMiddleware, RequestLoggerMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestIdMiddleware, RequestLoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
