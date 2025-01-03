import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DialableDataService } from './dialable-data.service';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UploadResponseDto } from './dtos/upload-response.dto';

@Controller('dialable-data')
export class DialableDataController {
  constructor(private readonly dialableDataService: DialableDataService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDialableData(
    @UploadedFile() file: Express.Multer.File,
    @Body('vendorName') vendorName: string,
    @Body('createdBy') createdBy: string,
  ) {
    if (!file) {
      throw new Error('File is required.');
    }
    const vendor = await this.dialableDataService.processVendor(
      vendorName,
      createdBy,
    );
    const response = await this.dialableDataService.processFile(
      file,
      vendor.id,
      createdBy,
    );
    return response;
  }

  @Post('vendors')
  async createVendor(@Body() createVendorDto: CreateVendorDto): Promise<any> {
    return this.dialableDataService.createVendor(createVendorDto);
  }
}
