import { Module } from '@nestjs/common';
import { DncService } from './dnc.service';
import { DncController } from './dnc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dnc } from './entities/dnc.entity';
import { DialingLog } from 'src/dialing-logs/entities/dialing-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dnc, DialingLog])],
  controllers: [DncController],
  providers: [DncService],
})
export class DncModule { }
