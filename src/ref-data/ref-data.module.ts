import { Module } from '@nestjs/common';
import { RefDataService } from './ref-data.service';
import { RefDataController } from './ref-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefRole } from './entities/ref-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefRole]),
  ],
  controllers: [RefDataController],
  providers: [RefDataService],
})
export class RefDataModule { }
