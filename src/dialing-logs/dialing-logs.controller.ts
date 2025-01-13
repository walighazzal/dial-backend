import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DialingLogsService } from './dialing-logs.service';

@Controller('dialing-logs')
export class DialingLogsController {
  constructor(private readonly dialingLogsService: DialingLogsService) { }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadDialingLog(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    return await this.dialingLogsService.processFiles(files);
  }

  // @Post('upload')
  // @UseInterceptors(FilesInterceptor('file'))
  // async uploadDialingLog(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body('createdBy') createdBy: string, // Accept createdBy from the request body
  // ) {
  //   if (!files) {
  //     throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
  //   }
  //   if (!createdBy) {
  //     throw new HttpException('CreatedBy is required', HttpStatus.BAD_REQUEST);
  //   }
  //   return await this.dialingLogsService.processFiles(files, createdBy);
  // }


  // @Post('save')
  // async saveData(@Body() data: any) {
  //   return this.dialingLogsService.saveData(data);
  // }
}
