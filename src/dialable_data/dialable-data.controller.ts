import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DialableDataService } from './dialable-data.service';
import { CreateVendorDto } from './dtos/create-vendor.dto';

@Controller('dialable-data')
export class DialableDataController {
  constructor(private readonly dialableDataService: DialableDataService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadDialableData(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('vendorName') vendorName: string,
    @Body('createdBy') createdBy: string,
  ) {
    if (!files) {
      throw new Error('File is required.');
    }
    const vendor = await this.dialableDataService.processVendor(
      vendorName,
      createdBy,
    );

    const response = await this.dialableDataService.processFiles(
      files,
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
