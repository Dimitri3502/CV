import 'reflect-metadata';
import {NestFactory} from '@nestjs/core';
import {API_GLOBAL_PREFIX} from '@cv/common';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_GLOBAL_PREFIX);
  app.enableCors({origin: true});

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}

void bootstrap();
