import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
  new ValidationPipe({
  whitelist: true,  
  forbidNonWhitelisted: true,
  }));
  app.enableCors({
    origin: ['http://localhost:4200'],
    origin: ['https://frontend-helpdesk-54750791481.southamerica-east1.run.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });
   const config = new DocumentBuilder()
    .setTitle('Help Desk API')
    .setDescription('API para la gestión de tickets de soporte')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
