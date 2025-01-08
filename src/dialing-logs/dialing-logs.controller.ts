import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DialingLogsService } from './dialing-logs.service';

@Controller('dialing-logs')
export class DialingLogsController {
  constructor(private readonly dialingLogsService: DialingLogsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDialingLog(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    return await this.dialingLogsService.processFile(file);
  }
}
