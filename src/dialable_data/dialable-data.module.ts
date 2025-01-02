import { Module } from '@nestjs/common';
import { DialableDataController } from './dialable-data.controller';
import { DialableDataService } from './dialable-data.service';

@Module({
  controllers: [DialableDataController],
  providers: [DialableDataService],
})
export class DialableDataModule {}
