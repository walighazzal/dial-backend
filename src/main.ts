import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Get configuration service
  const configService = app.get(ConfigService);
  // Start the application
  const port = configService.get<number>('PORT'); // Use PORT from config or default to 3000

  let allowedOrigins: string[];

  if (process.env.ALLOWED_CLIENTS) {
    allowedOrigins = process.env.ALLOWED_CLIENTS.split(',');
  }

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins?.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  app.enableCors(corsOptions);
  // Use compression middleware
  app.use(compression());

  await app.listen(port ?? 8000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
