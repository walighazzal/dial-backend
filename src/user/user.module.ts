import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { Designation } from "src/ref/designation.entity";
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Users])],
  providers: [UserService],
  controllers: [UserController],

  exports: [UserService],
})
export class UsersModule {}
