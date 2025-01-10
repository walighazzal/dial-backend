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

  // async mergeDialableDataWithLogs(
  //   dialableData: DialableData[],
  //   dialingLogs: DialingLog[],
  // ) {
  //   const mergedResults = dialableData.map((data) => {
  //     const logs = dialingLogs.filter((log) => log.phoneNumberDialed === data.number);

  //     return {
  //       ...data,
  //       dialingLogs: logs.map((log) => ({
  //         fileName: log.fileName,
  //         totalCount: log.totalCount,
  //         lengthInSecs: log.lengthInSecs,
  //         statusNames: log.statusNames,
  //       })),
  //     };
  //   });

  //   return mergedResults;
  // }

  // async getDialableDataByCreatedBy(createdBy: string): Promise<DialableData[]> {
  //   return this.dataSource.manager.find(DialableData, {
  //     where: { createdBy },
  //   });
  // }

  // async getDialingLogsByCreatedBy(createdBy: string): Promise<DialingLog[]> {
  //   return this.dataSource.manager.find(DialingLog, {
  //     where: { createdBy },
  //   });
  // }

  // async mergeDialableDataWithLogs(
  //   dialableData: DialableData[],
  //   dialingLogs: DialingLog[],
  // ): Promise<any[]> {
  //   return dialableData.map((data) => {
  //     const logs = dialingLogs.filter((log) => log.phoneNumberDialed === data.number);

  //     return {
  //       number: data.number,
  //       fileName: logs.map((log) => log.fileName).join(', '),
  //       areaCode: data.areaCode,
  //       stateName: logs[0]?.stateName || data.stateName, // Use stateName from logs if available
  //       stateCode: logs[0]?.stateCode || data.stateCode, // Use stateCode from logs if available
  //       totalCount: logs.reduce((sum, log) => sum + log.totalCount, 0),
  //       lengthInSecs: logs.reduce((sum, log) => sum + log.lengthInSecs, 0),
  //       callDates: logs.flatMap((log) => log.callDates),
  //       statusNames: logs.flatMap((log) => log.statusNames),
  //     };
  //   });
  // }

  // async saveMergedDataToDialingLogs(mergedData: any[]): Promise<void> {
  //   for (const data of mergedData) {
  //     await this.dataSource.manager.insert(DialingLog, {
  //       phoneNumberDialed: data.number,
  //       fileName: data.fileName,
  //       areaCode: data.areaCode,
  //       stateName: data.stateName,
  //       stateCode: data.stateCode,
  //       totalCount: data.totalCount,
  //       lengthInSecs: data.lengthInSecs,
  //       callDates: data.callDates,
  //       statusNames: data.statusNames,
  //     });
  //   }
  // }


}

