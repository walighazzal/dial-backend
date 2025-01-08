import { IsNotEmpty } from 'class-validator';

export class UploadDialingLogsDto {
  @IsNotEmpty()
  file: Express.Multer.File;
}
