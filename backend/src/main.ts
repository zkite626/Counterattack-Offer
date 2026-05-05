import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { AppModule } from './app.module';
import { createCorsOptions } from './config/cors';
import type { AppEnvironment } from './config/environment';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    const configService =
      app.get<ConfigService<AppEnvironment, true>>(ConfigService);
    const port = configService.get('PORT', { infer: true });
    const swaggerPath = configService.get('SWAGGER_PATH', { infer: true });
    app.setGlobalPrefix('api/v1');
    app.enableCors(createCorsOptions(configService));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ApiResponseInterceptor<unknown>());

    const swaggerConfig = new DocumentBuilder()
      .setTitle('逆袭Offer API')
      .setDescription('逆袭Offer 独立后端 API v1 契约')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(swaggerPath, app, swaggerDocument, {
      jsonDocumentUrl: `${swaggerPath}/openapi.json`,
    });

    await app.listen(port);

    logger.log(`API server listening on http://localhost:${port}/api/v1`);
    logger.log(
      `Swagger docs available at http://localhost:${port}/${swaggerPath}`,
    );
  } catch (error) {
    logger.error(
      'NestJS 服务启动失败',
      error instanceof Error ? error.stack : undefined,
    );
    process.exit(1);
  }
}

void bootstrap();
