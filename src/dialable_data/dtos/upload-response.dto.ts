import { IsString } from "class-validator";

export class UploadResponseDto {
  // uploadId: string;
  // createdBy: string;
  // vendorId: string;
  // file: string;
  // newRecords: number;
  // duplicateRecords: number;
  // uploadFilePath: string;


   @IsString()
    number: string;
  
    @IsString()
    stateName: string;
  
    @IsString()
    stateCode: string;
  
    @IsString()
    areaCode: string;

   

}
