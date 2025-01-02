import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UploadResponseDto } from './dtos/upload-response.dto';
import { parseFile } from './utils/file-parser.util';
import { calculateStateDetails } from './utils/state-calculator.util';

@Injectable()
export class DialableDataService {
  async processVendor(vendorId: string, vendorName: string, createdBy: string) {
    // Logic to create or fetch the vendor
    return { id: vendorId || 'sample-vendor-id', name: vendorName };
  }

  async processFile(
    file: Express.Multer.File,
    vendorId: string,
    createdBy: string,
  ): Promise<UploadResponseDto> {
    const parsedData = parseFile(file);
    const uniqueNumbers = new Set<string>();
    const duplicates = new Set<string>();

    parsedData.forEach((row) => {
      if (uniqueNumbers.has(row.number)) {
        duplicates.add(row.number);
      } else {
        uniqueNumbers.add(row.number);
      }
    });

    const stateDetails = Array.from(uniqueNumbers).map((number) => ({
      number,
      ...calculateStateDetails(number),
    }));

    // Save to DB (mocked here)
    console.log(
      `Saving ${stateDetails.length} records to the database for vendor: ${vendorId}`,
    );

    // Return result
    return {
      uploadId: 'generated-upload-id',
      newRecords: stateDetails.length - duplicates.size,
      duplicateRecords: duplicates.size,
      resultFilePath: `/results/result-${Date.now()}.xlsx`,
    };
  }

  async createVendor(createVendorDto: CreateVendorDto) {
    return { vendorId: 'new-vendor-id', ...createVendorDto };
  }
}
