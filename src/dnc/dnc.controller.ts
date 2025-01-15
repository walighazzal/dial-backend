import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DncService } from './dnc.service';
import { Response } from 'express';

@Controller('dnc')
export class DncController {
  constructor(private readonly dncService: DncService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDncFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    try {
      const result = await this.dncService.processDncFile(file);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


}
