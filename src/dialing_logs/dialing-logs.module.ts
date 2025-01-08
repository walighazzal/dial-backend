import { Module } from '@nestjs/common';
import { DialingLogsController } from 'src/dialing-logs/dialing-logs.controller';
import { DialingLogsService } from '../dialing-logs/dialing-logs.service';
@Module({
  controllers: [DialingLogsController],
  providers: [DialingLogsService],
})
export class DialingLogsModule {}
