import { Module } from '@nestjs/common';
import { DialingLogsService } from './dialing-logs.service';
import { DialingLogsController } from './dialing-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialingLog } from './entities/dialing-log.entity';
import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DialingLog, DialableData])],
  controllers: [DialingLogsController],
  providers: [DialingLogsService],
})
export class DialingLogsModule { }
