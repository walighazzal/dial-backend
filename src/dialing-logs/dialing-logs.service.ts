import { Injectable } from '@nestjs/common';
import { CreateDialingLogDto } from './dto/create-dialing-log.dto';
import { UpdateDialingLogDto } from './dto/update-dialing-log.dto';

@Injectable()
export class DialingLogsService {
  create(createDialingLogDto: CreateDialingLogDto) {
    return 'This action adds a new dialingLog';
  }

  findAll() {
    return `This action returns all dialingLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dialingLog`;
  }

  update(id: number, updateDialingLogDto: UpdateDialingLogDto) {
    return `This action updates a #${id} dialingLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} dialingLog`;
  }
}
