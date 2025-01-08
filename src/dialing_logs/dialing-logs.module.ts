import { Module } from '@nestjs/common';
import { DialingLogsController } from './controllers/dialing-logs.controller';
import { DialingLogsService } from './services/dialing-logs.service';
import { FileProcessingService } from './services/file-processing.service';

@Module({
  controllers: [DialingLogsController],
  providers: [DialingLogsService, FileProcessingService],
})
export class DialingLogsModule {}
