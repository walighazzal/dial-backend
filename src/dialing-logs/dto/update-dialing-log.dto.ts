import { PartialType } from '@nestjs/mapped-types';
import { CreateDialingLogDto } from './create-dialing-log.dto';

export class UpdateDialingLogDto extends PartialType(CreateDialingLogDto) { }
