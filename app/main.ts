import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import express from 'express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

function setupSwagger(app: INestApplication): void {
  const documentBuilder: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Nest.js example')
    .setDescription('This is example for nest.js')
    .setVersion('1.0')
    .addBasicAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    documentBuilder,
  );
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
}

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(express.json());
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  setupSwagger(app);
  await app.listen(3000, () => {
    console.log('Server started');
  });
}

bootstrap();
