import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CONFIGURATION } from 'configuration';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(CONFIGURATION.storage.images.path, {
    prefix: CONFIGURATION.storage.images.prefix,
    maxAge: 1000 * 60 * 60 * 24,
    index: false
  })
  await app.listen(process.env.PORT || 8080);
}

bootstrap();
