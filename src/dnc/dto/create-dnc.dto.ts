import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDncDto {
  @IsString()
  phoneNumber: string;

  @IsNumber()
  totalCount: number;

  @IsString()
  lengthInSecs: string;

  @IsString()
  callDates: string;

  @IsString()
  statusNames: string;

  @IsString()
  fileNames: string;

  @IsString()
  areaCode: string;

  @IsString()
  stateCode: string;

  @IsString()
  stateName: string;

  @IsString()
  dncFileName: string;

  @IsString()
  sessionId: string;
}
