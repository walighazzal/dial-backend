import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { FileProcessingService } from './file-processing.service';

@Injectable()
export class DialingLogsService {
  constructor(private readonly fileProcessingService: FileProcessingService) {}

  async processFile(file: Express.Multer.File): Promise<any> {
    const data = parse(file.buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
    });
    const result = this.fileProcessingService.processData(data);
    return result;
  }
}
