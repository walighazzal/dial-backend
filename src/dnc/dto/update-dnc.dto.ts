import { PartialType } from '@nestjs/mapped-types';
import { CreateDncDto } from './create-dnc.dto';

export class UpdateDncDto extends PartialType(CreateDncDto) {}
