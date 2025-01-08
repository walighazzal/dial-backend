import { Module } from '@nestjs/common';
import { DialingLogsService } from './dialing-logs.service';
import { DialingLogsController } from './dialing-logs.controller';

@Module({
  controllers: [DialingLogsController],
  providers: [DialingLogsService],
})
export class DialingLogsModule {}
