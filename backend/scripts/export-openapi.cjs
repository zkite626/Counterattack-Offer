#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
require('reflect-metadata');

const { NestFactory } = require('@nestjs/core');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const { AppModule } = require('../dist/app.module');

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const defaultOutputPath = path.resolve(
    __dirname,
    '../../docs/openapi/openapi-v1.json',
  );
  const outputPath =
    process.env.OPENAPI_OUTPUT === undefined
      ? defaultOutputPath
      : path.resolve(process.cwd(), process.env.OPENAPI_OUTPUT);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('逆袭Offer API')
    .setDescription('逆袭Offer 独立后端 API v1 契约')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
  await app.close();

  console.log(`OpenAPI v1 exported to ${outputPath}`);
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
