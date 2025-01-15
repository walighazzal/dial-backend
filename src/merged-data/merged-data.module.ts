import { Module } from '@nestjs/common';
import { MergedDataService } from './merged-data.service';
import { MergedDataController } from './merged-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';
import { DialingLog } from 'src/dialing-logs/entities/dialing-log.entity';
import { Dnc } from 'src/dnc/entities/dnc.entity';
import { MergedData } from './entities/merged-datum.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DialableData, DialingLog, Dnc, MergedData]),
  ],
  controllers: [MergedDataController],
  providers: [MergedDataService],
})
export class MergedDataModule { }
