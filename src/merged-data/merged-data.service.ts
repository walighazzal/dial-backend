// import { Injectable } from '@nestjs/common';
// import { CreateMergedDatumDto } from './dto/create-merged-datum.dto';
// import { UpdateMergedDatumDto } from './dto/update-merged-datum.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';
// import { DialingLog } from 'src/dialing-logs/entities/dialing-log.entity';
// import { Dnc } from 'src/dnc/entities/dnc.entity';
// import { MergedData } from './entities/merged-datum.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class MergedDataService {

//   constructor(
//     @InjectRepository(DialableData) private readonly dialableDataRepository: Repository<DialableData>,
//     @InjectRepository(DialingLog) private readonly dialingLogRepository: Repository<DialingLog>,
//     @InjectRepository(Dnc) private readonly dncRepository: Repository<Dnc>,
//     @InjectRepository(MergedData) private readonly combinedDataRepository: Repository<MergedData>,
//   ) { }

//   async mergeEntities(): Promise<any> {
//     // Fetch data from all entities
//     const dialableData = await this.dialableDataRepository.find();
//     const dialingLogData = await this.dialingLogRepository.find();
//     const dncData = await this.dncRepository.find();

//     // Collect all unique phone numbers
//     const phoneNumbers = new Set<string>([
//       ...dialableData.map((data) => data.number),
//       ...dialingLogData.map((log) => log.phoneNumberDialed),
//       ...dncData.map((dnc) => dnc.phoneNumber),
//     ]);

//     const combinedData = Array.from(phoneNumbers).map((phoneNumber) => {
//       const dialableMatch = dialableData.find((data) => data.number === phoneNumber);
//       const dialingLogMatch = dialingLogData.find((log) => log.phoneNumberDialed === phoneNumber);
//       const dncMatch = dncData.find((dnc) => dnc.phoneNumber === phoneNumber);

//       // Create a new record for CombinedData
//       return this.combinedDataRepository.create({
//         phoneNumber: phoneNumber,
//         stateName: dialableMatch?.stateName || null,
//         stateCode: dialableMatch?.stateCode || null,
//         areaCode: dialableMatch?.areaCode || null,
//         totalCount: dialingLogMatch?.totalCount || null,
//         lengthInSecs: dialingLogMatch?.lengthInSecs || null,
//         callDates: dialingLogMatch?.callDates || null,
//         statusNames: dialingLogMatch?.statusNames || null,
//         fileNames: dialingLogMatch?.fileNames || null,
//         dnc: dncMatch ? 'DNC' : null,
//         dncFileName: dncMatch?.dncFileName || null,
//       });
//     });

//     // Save the combined data
//     await this.combinedDataRepository.save(combinedData);

//     return {
//       message: 'Entities merged successfully',
//       totalRecords: combinedData.length,
//       combinedData,
//     };
//   }

//   // Fetch all combined data
//   async getAllCombinedData(): Promise<MergedData[]> {
//     return await this.combinedDataRepository.find();
//   }
// }


import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';
import { DialingLog } from 'src/dialing-logs/entities/dialing-log.entity';
import { Dnc } from 'src/dnc/entities/dnc.entity';
import * as xlsx from 'xlsx';
import { Response } from 'express';
import { MergedData } from './entities/merged-datum.entity';

@Injectable()
export class MergedDataService {
  constructor(
    @InjectRepository(DialableData) private readonly dialableDataRepository: Repository<DialableData>,
    @InjectRepository(DialingLog) private readonly dialingLogRepository: Repository<DialingLog>,
    @InjectRepository(Dnc) private readonly dncRepository: Repository<Dnc>,
    @InjectRepository(MergedData) private readonly combinedDataRepository: Repository<MergedData>,
  ) { }

  async mergeEntities(): Promise<any> {
    // Fetch data from all entities
    const dialableData = await this.dialableDataRepository.find();
    const dialingLogData = await this.dialingLogRepository.find();
    const dncData = await this.dncRepository.find();

    // Collect all unique phone numbers
    const phoneNumbers = new Set<string>([
      ...dialableData.map((data) => data.number),
      ...dialingLogData.map((log) => log.phoneNumberDialed),
      ...dncData.map((dnc) => dnc.phoneNumber),
    ]);

    // Create the combined data
    const combinedData = Array.from(phoneNumbers).map((phoneNumber) => {
      const dialableMatch = dialableData.find((data) => data.number === phoneNumber);
      const dialingLogMatch = dialingLogData.find((log) => log.phoneNumberDialed === phoneNumber);
      const dncMatch = dncData.find((dnc) => dnc.phoneNumber === phoneNumber);

      return this.combinedDataRepository.create({
        phoneNumber: phoneNumber,
        stateName: dialableMatch?.stateName || null,
        stateCode: dialableMatch?.stateCode || null,
        areaCode: dialableMatch?.areaCode || null,
        totalCount: dialingLogMatch?.totalCount || null,
        lengthInSecs: dialingLogMatch?.lengthInSecs || null,
        callDates: dialingLogMatch?.callDates || null,
        statusNames: dialingLogMatch?.statusNames || null,
        fileNames: dialingLogMatch?.fileNames || null,
        dnc: dncMatch ? 'DNC' : null,
        dncFileName: dncMatch?.dncFileName || null,
      });
    });

    // Save combined data in batches to avoid performance issues with large datasets
    const batchSize = 1000; // Adjust this size if needed for your DB performance
    const batches = this.createBatches(combinedData, batchSize);

    for (const batch of batches) {
      await this.combinedDataRepository.save(batch);
    }

    return {
      message: 'Entities merged successfully',
      totalRecords: combinedData.length,
      combinedData,
    };
  }




  private createBatches<T>(data: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  // Fetch all combined data
  async getAllCombinedData(): Promise<MergedData[]> {
    return await this.combinedDataRepository.find();
  }



}
