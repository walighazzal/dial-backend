import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DialingLogsService } from './dialing-logs.service';
import { CreateDialingLogDto } from './dto/create-dialing-log.dto';
import { UpdateDialingLogDto } from './dto/update-dialing-log.dto';

@Controller('dialing-logs')
export class DialingLogsController {
  constructor(private readonly dialingLogsService: DialingLogsService) {}

  @Post()
  create(@Body() createDialingLogDto: CreateDialingLogDto) {
    return this.dialingLogsService.create(createDialingLogDto);
  }

  @Get()
  findAll() {
    return this.dialingLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dialingLogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDialingLogDto: UpdateDialingLogDto) {
    return this.dialingLogsService.update(+id, updateDialingLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dialingLogsService.remove(+id);
  }
}
