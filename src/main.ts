import helmet from 'helmet';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  const APP_PORT = parseInt(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.use(helmet());
  app.use(morgan('dev'));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, errorHttpStatusCode: 422 }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('API Docs for the Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/v1/docs', app, document, {
    swaggerOptions: { tagsSorter: 'alpha' },
  });

  await app.listen(APP_PORT);
}

bootstrap();
