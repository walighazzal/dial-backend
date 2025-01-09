import { IsDate, IsInt, IsString } from 'class-validator';

export class CreateDialingLogDto {
  @IsString()
  phoneNumberDialed: string;

  @IsString()
  fileName: string;

  @IsString()
  areaCode: string;

  @IsString()
  stateName: string;

  @IsString()
  stateCode: string;

  @IsInt()
  totalCount: number;

  @IsInt()
  lengthInSecs: number;

  @IsString()
  callDates: string;

  @IsString()
  statusNames: string;

  @IsString()
  fileNames: string;
}
