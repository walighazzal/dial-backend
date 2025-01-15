import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { MergedDataService } from './merged-data.service';
import { Response } from 'express';

@Controller('merged-data')
export class MergedDataController {
  constructor(private readonly mergedDataService: MergedDataService) { }


  // Endpoint to process and merge data from entities
  @Post('merge')
  async mergeData() {
    return await this.mergedDataService.mergeEntities();
  }

  // Endpoint to fetch all combined data
  @Get()
  async getAllCombinedData() {
    return await this.mergedDataService.getAllCombinedData();
  }



}
