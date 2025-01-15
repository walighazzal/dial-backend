import { PartialType } from '@nestjs/mapped-types';
import { CreateMergedDatumDto } from './create-merged-datum.dto';

export class UpdateMergedDatumDto extends PartialType(CreateMergedDatumDto) { }
