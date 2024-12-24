import { ConfigService } from '@nestjs/config';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileHandlingService {
  constructor(private configService: ConfigService) {}

  /**
   * Uploads file to the azure bucket and return url of the uploaded file
   * @param file
   * @returns url : url of the uploaded file
   */
  async upload(file: any) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );

    //const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_BASE_URL);

    const containerClient = blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER_NAME,
    );

    const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
    const fileName = `${uuidv4()}.filename-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(file.buffer, options);
    return `${process.env.AZURE_STORAGE_BASE_URL}/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${fileName}`;
  }
}
