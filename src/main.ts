import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Expense Manager API')
    .setDescription('API cho app quản lý chi tiêu')
    .setVersion('1.0')
    .addBearerAuth() // Cho phép test với JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Truy cập: http://localhost:3000/api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
