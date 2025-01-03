export class UploadResponseDto {
  uploadId: string;
  createdBy: string;
  vendorId: string;
  file: string;
  newRecords: number;
  duplicateRecords: number;
  uploadFilePath: string;
}
