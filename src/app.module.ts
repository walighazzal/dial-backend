import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './app/exception-handler';
import { UsersModule } from './user/user.module';
import { AuditSubscriber } from './audit/EventSubscriber';
import { ScheduleModule } from '@nestjs/schedule';
import { FileHandlingModule } from './file-handling/file-handling.module';
import { DialableDataModule } from './dialable_data/dialable-data.module';

@Module({
  imports: [
    DialableDataModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    ScheduleModule,
    UsersModule,
    UsersModule,
    FileHandlingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AuditSubscriber,
  ],
})
export class AppModule {}
