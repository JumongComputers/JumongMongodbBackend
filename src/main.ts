import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ------------------------
  // Global Validation
  // ------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true, // throws error on extra fields
      transform: true, // auto-transform payloads to DTO instances
    }),
  );

  // ------------------------
  // Swagger Configuration
  // ------------------------
  const config = new DocumentBuilder()
    .setTitle('JMG Ecommerce API')
    .setDescription('API documentation for JMG ecommerce platform')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // Name of security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ------------------------
  // Start server
  // ------------------------
  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000`);
  console.log(`📖 Swagger docs available at http://localhost:3000/api`);
}

bootstrap();