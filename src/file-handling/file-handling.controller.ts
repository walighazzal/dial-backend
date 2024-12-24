import {
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; //eslint-disable-line

import { FileHandlingService } from './file-handling.service';

@Controller('file-handling')
export class FileHandlingController {
  constructor(private fileUpload: FileHandlingService) {}
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { url: await this.fileUpload.upload(file) };
  }
}
