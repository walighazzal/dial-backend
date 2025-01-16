import { PartialType } from '@nestjs/mapped-types';
import { CreateRefDatumDto } from './create-ref-datum.dto';

export class UpdateRefDatumDto extends PartialType(CreateRefDatumDto) {}
