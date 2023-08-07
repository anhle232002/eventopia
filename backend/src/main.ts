import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LogExceptionFilter } from './common/filters/log-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({ credentials: true, origin: [process.env.CLIENT_URL, 'http://localhost:3714'] });
  // app.useGlobalFilters(new LogExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Eventopia API')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
