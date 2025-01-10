// import { Injectable } from '@nestjs/common';
// import { parse } from 'csv-parse/sync';
// import { calculateStateDetails, calculateLengthInSeconds } from 'src/utils/functions';


// @Injectable()
// export class DialingLogsService {
//   async processFile(file: Express.Multer.File): Promise<any> {

//     // Remove UTF-8 BOM if present
//     const fileContent = file.buffer.toString().replace(/^\uFEFF/, '');

//     const data = parse(fileContent, {
//       columns: true,
//       skip_empty_lines: true,
//     });
//     const result = this.processData(data);
//     return result;
//   }

//   processData(data: any[]): any {
//     const result = [];
//     const errors = [];

//     data.forEach((row, index) => {
//       const phoneNumber = row['Phone Number'] || row['Phone'];
//       if (!phoneNumber) {
//         errors.push({ row: index + 1, error: 'Phone Number is missing' });
//         return;
//       }

//       const { areaCode, stateName, stateCode } =
//         calculateStateDetails(phoneNumber);
//       const lengthInSeconds = calculateLengthInSeconds(
//         row['Length'],
//         row['Queue Wait'],
//         row['Wrap Up Time'],
//       );

//       result.push({
//         phone_number_dialed: phoneNumber,
//         FileName: row['List Name'],
//         AreaCode: areaCode,
//         StateName: stateName,
//         StateCode: stateCode,
//         TotalCount: 1, // Placeholder for aggregation logic
//         length_in_secs: lengthInSeconds,
//         call_dates: row['Date'],
//         status_names: row['Status'],
//         FileNames: row['List Name'],
//       });
//     });

//     return { result, errors };
//   }
// }


// my second
// import { Injectable } from '@nestjs/common';
// import { parse } from 'csv-parse/sync';
// import { calculateStateDetails, calculateLengthInSeconds } from 'src/utils/functions';

// @Injectable()
// export class DialingLogsService {
//   async processFiles(files: Express.Multer.File[]): Promise<any> {
//     const phoneDataMap = new Map<string, any>(); // Map to aggregate phone data
//     const errors = [];

//     for (const file of files) {
//       // Remove UTF-8 BOM if present
//       const fileContent = file.buffer.toString().replace(/^\uFEFF/, '');

//       // Parse the CSV file
//       const data = parse(fileContent, {
//         columns: true,
//         skip_empty_lines: true,
//       });

//       data.forEach((row, index) => {
//         const phoneNumber = row['Phone Number'] || row['Phone'];
//         if (!phoneNumber) {
//           errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
//           return;
//         }

//         const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);
//         const lengthInSeconds = calculateLengthInSeconds(
//           row['Length'],
//           row['Queue Wait'],
//           row['Wrap Up Time'],
//         );

//         // If the phone number exists, aggregate data
//         if (phoneDataMap.has(phoneNumber)) {
//           const existingData = phoneDataMap.get(phoneNumber);

//           existingData.FileNames = this.aggregateValues(existingData.FileNames, row['List Name']);
//           existingData.status_names = this.aggregateValues(existingData.status_names, row['Status']);
//           existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date']);
//           existingData.TotalCount += 1;

//           // existingData.length_in_secs += lengthInSeconds;
//           existingData.length_in_secs = this.aggregateValues(existingData.length_in_secs, lengthInSeconds.toString());
//         } else {
//           // If the phone number is new, add to the map
//           phoneDataMap.set(phoneNumber, {
//             phone_number_dialed: phoneNumber,
//             FileName: row['List Name'],
//             AreaCode: areaCode,
//             StateName: stateName,
//             StateCode: stateCode,
//             TotalCount: 1,
//             length_in_secs: lengthInSeconds,
//             call_dates: row['Date'],
//             status_names: row['Status'],
//             FileNames: row['List Name'],
//           });
//         }
//       });
//     }

//     // Convert the map to an array and return
//     const result = Array.from(phoneDataMap.values());
//     return { result, errors };
//   }

//   /**
//    * Helper method to aggregate values and avoid duplicates
//    */
//   private aggregateValues(existingValue: string, newValue: string): string {
//     if (!existingValue) return newValue;
//     if (!newValue) return existingValue;

//     const existingValuesArray = existingValue.split(', ').map((v) => v.trim());
//     if (!existingValuesArray.includes(newValue)) {
//       return `${existingValue}, ${newValue}`;
//     }
//     return existingValue;
//   }
// }


// my third 

import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import * as xlsx from 'xlsx';
import { calculateLengthInSeconds } from 'src/utils/functions';
import { calculateStateDetails } from 'src/dialable_data/utils/state-calculator.util';
import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';
import { DialingLog } from './entities/dialing-log.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class DialingLogsService {

  constructor(private readonly dataSource: DataSource) { }

  async processFiles(files: Express.Multer.File[]): Promise<any> {
    const phoneDataMap = new Map<string, any>(); // Map to aggregate phone data
    const errors = [];

    for (const file of files) {
      let data: any[] = [];

      // Determine file type and parse accordingly
      if (file.originalname.endsWith('.csv')) {
        // Remove UTF-8 BOM if present
        const fileContent = file.buffer.toString().replace(/^\uFEFF/, '');

        // Parse the CSV file
        data = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          relax_column_count: true,
        });
      } else if (file.originalname.endsWith('.xlsx')) {
        // Parse XLSX file
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Use the first sheet
        data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        errors.push({ fileName: file.originalname, error: 'Unsupported file format' });
        continue;
      }

      // Process parsed data
      data.forEach((row, index) => {
        const phoneNumber = row['Phone Number'] || row['Phone'] || row['phone_number_dialed'];
        if (!phoneNumber) {
          errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
          return;
        }

        const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);
        // const lengthInSeconds = calculateLengthInSeconds(
        //   row['Length'],
        //   row['Queue Wait'],
        //   row['Wrap Up Time'],
        // );

        // If the phone number exists, aggregate data
        if (phoneDataMap.has(phoneNumber)) {
          const existingData = phoneDataMap.get(phoneNumber);

          existingData.FileNames = this.aggregateValues(existingData.FileNames, file.originalname);
          existingData.status_names = this.aggregateValues(existingData.status_names, row['Status']);
          existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date'] || row['call_date']);
          existingData.TotalCount += 1;

          // existingData.length_in_secs = this.aggregateValues(existingData.length_in_secs, lengthInSeconds.toString());
          existingData.length_in_secs = this.aggregateValues(existingData.length_in_secs, row['length_in_sec'] || row['Length']);
        } else {
          // If the phone number is new, add to the map
          phoneDataMap.set(phoneNumber, {
            phone_number_dialed: phoneNumber,
            FileName: row['List Name'],
            AreaCode: areaCode,
            StateName: stateName,
            StateCode: stateCode,
            TotalCount: 1,
            length_in_secs: row['length_in_sec'] || row['Length'],
            call_dates: row['Date'] || row['call_date'],
            status_names: row['Status'],
            FileNames: file.originalname,
          });
        }
      });
    }

    // Convert the map to an array and return
    const result = Array.from(phoneDataMap.values());
    return { result, errors };

    ////////////////////

    //   // Combine data with DialableData and save to DialingLog
    //   const result = await this.saveDialingLogs(phoneDataMap);
    //   return { result, errors };
    // }

    // private async saveDialingLogs(phoneDataMap: Map<string, any>) {
    //   const phoneNumbers = Array.from(phoneDataMap.keys());

    //   // Retrieve matching DialableData for these phone numbers
    //   const dialableDataRecords = await this.dataSource
    //     .getRepository(DialableData)
    //     .createQueryBuilder('dialableData')
    //     .where('dialableData.number IN (:...phoneNumbers)', { phoneNumbers })
    //     .getMany();

    //   const dialingLogs = [];
    //   for (const phoneNumber of phoneNumbers) {
    //     const dialableData = dialableDataRecords.find(
    //       (data) => data.number === phoneNumber,
    //     );
    //     if (dialableData) {
    //       const phoneData = phoneDataMap.get(phoneNumber);
    //       const dialingLog = this.dataSource.manager.create(DialingLog, {
    //         phoneNumberDialed: phoneNumber,
    //         fileName: phoneData.FileName,
    //         areaCode: dialableData.areaCode,
    //         stateName: dialableData.stateName,
    //         stateCode: dialableData.stateCode,
    //         totalCount: phoneData.TotalCount,
    //         lengthInSecs: phoneData.length_in_secs,
    //         callDates: phoneData.call_dates,
    //         statusNames: phoneData.status_names,
    //         fileNames: phoneData.FileNames,
    //         dialableData,
    //       });
    //       dialingLogs.push(dialingLog);
    //     }
    //   }

    //   // Save all logs to the database
    //   await this.dataSource.manager.save(DialingLog, dialingLogs);
    //   return dialingLogs;
    // }

    /////////////////////
  }

  /**
   * Helper method to aggregate values and avoid duplicates
   */
  // private aggregateValues(existingValue: string, newValue: string): string {
  //   if (!existingValue) return newValue;
  //   if (!newValue) return existingValue;

  //   const existingValuesArray = existingValue.split(', ').map((v) => v.trim());
  //   if (!existingValuesArray.includes(newValue)) {
  //     return `${existingValue}, ${newValue}`;
  //   }
  //   return existingValue;
  // }

  private aggregateValues(existingValue: any, newValue: any): string {
    // Convert values to strings if they are not already strings
    const existingStr = typeof existingValue === 'string' ? existingValue : '';
    const newStr = typeof newValue === 'string' ? newValue : '';

    // If either value is empty, return the non-empty value
    if (!existingStr) return newStr;
    if (!newStr) return existingStr;

    // Split the existing value into an array and check for duplicates
    const existingValuesArray = existingStr.split(', ').map((v) => v.trim());
    if (!existingValuesArray.includes(newStr)) {
      return `${existingStr}, ${newStr}`;
    }
    return existingStr;
  }

}
