import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalExceptionFilter } from './app/exception-handler';
import { AuditSubscriber } from './audit/EventSubscriber';
import { DialableDataModule } from './dialable_data/dialable-data.module';
import { DialingLogsController } from './dialing-logs/dialing-logs.controller';
import { DialingLogsModule } from './dialing-logs/dialing-logs.module';
import { DialingLogsService } from './dialing-logs/dialing-logs.service';
import { FileHandlingModule } from './file-handling/file-handling.module';
import { UsersModule } from './user/user.module';
import { DncModule } from './dnc/dnc.module';
import { MergedDataModule } from './merged-data/merged-data.module';
import { RefDataModule } from './ref-data/ref-data.module';

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
    DialingLogsModule,
    DncModule,
    MergedDataModule,
    RefDataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AuditSubscriber,
    // DialingLogsService,
  ],
})
export class AppModule { }
