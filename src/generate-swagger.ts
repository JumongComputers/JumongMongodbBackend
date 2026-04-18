import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // Disable logs
    snapshot: false,
  });

  // Optional: Disable guards if they cause issues
  app.useGlobalGuards(); // This can help sometimes

  const config = new DocumentBuilder()
    .setTitle('JMG Ecommerce API')
    .setDescription('API documentation for JMG ecommerce platform')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./jmg-api.json', JSON.stringify(document, null, 2));

  console.log('✅ Success! File generated: jmg-api.json');
  console.log('You can now import this file into Postman.');

  await app.close();
}

generateSwagger().catch((err) => {
  console.error('❌ Error generating swagger:', err.message);
});
