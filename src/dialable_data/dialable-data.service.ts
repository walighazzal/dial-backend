import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { parseFile } from './utils/file-parser.util';
import { calculateStateDetails } from './utils/state-calculator.util';
import { DataSource, Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { DialableData } from './entities/dialable-data.entity';
import { DialingLog } from 'src/dialing-logs/entities/dialing-log.entity';

@Injectable()
export class DialableDataService {
  constructor(private dataSource: DataSource) { }

  async processVendor(vendorName: string, createdBy: string) {
    // Logic to create or fetch the vendor
    const vendor = await this.createVendor({
      name: vendorName,
      createdBy: createdBy,
    });
    return { id: vendor.id, name: vendorName };
  }

  async createVendor(createVendorDto: CreateVendorDto) {
    return this.dataSource.manager.save(Vendor, createVendorDto);
  }

  async processFiles(
    files: Express.Multer.File[],
    id: string,
    createdBy: string,
  ) {
    const allParsedData = files.flatMap((file) => parseFile(file));

    const uniqueNumbers = new Set<string>();
    const duplicates = new Set<string>();

    allParsedData.forEach((row) => {
      if (uniqueNumbers.has(row.phone_number)) {
        duplicates.add(row.phone_number);
      } else {
        uniqueNumbers.add(row.phone_number);
      }
    });

    const stateDetails = Array.from(uniqueNumbers).map((phone_number) => ({
      phone_number,
      ...calculateStateDetails(phone_number),
    }));

    await Promise.all(
      stateDetails.map((data) =>
        this.dataSource.manager.save(DialableData, {
          createdBy,
          stateName: data.stateName,
          stateCode: data.stateCode,
          areaCode: data.areaCode,
          number: data.phone_number,
        }),
      ),
    );

    // Return result
    return {
      uploadId: 'generated-upload-id',
      newRecords: stateDetails.length,
      duplicateRecords: duplicates.size,
    };
  }






}

