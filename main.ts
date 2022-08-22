import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'http://194.58.102.237:3050', 'http://194.58.102.237:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: ['Origin', 'Content-Type', 'X-Auth-Token'],

    },
  });

  app.use(json({ limit: '10mb' }));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('ONE-LAB')
    .setDescription('Документация rest api')
    .setVersion('1.0.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
