import { Controller } from '@nestjs/common';
import { RefDataService } from './ref-data.service';

@Controller('ref-data')
export class RefDataController {
  constructor(private readonly refDataService: RefDataService) { }
}
