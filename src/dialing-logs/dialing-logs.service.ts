// // // import { Injectable } from '@nestjs/common';
// // // import { parse } from 'csv-parse/sync';
// // // import { calculateStateDetails, calculateLengthInSeconds } from 'src/utils/functions';


// // // @Injectable()
// // // export class DialingLogsService {
// // //   async processFile(file: Express.Multer.File): Promise<any> {

// // //     // Remove UTF-8 BOM if present
// // //     const fileContent = file.buffer.toString().replace(/^\uFEFF/, '');

// // //     const data = parse(fileContent, {
// // //       columns: true,
// // //       skip_empty_lines: true,
// // //     });
// // //     const result = this.processData(data);
// // //     return result;
// // //   }

// // //   processData(data: any[]): any {
// // //     const result = [];
// // //     const errors = [];

// // //     data.forEach((row, index) => {
// // //       const phoneNumber = row['Phone Number'] || row['Phone'];
// // //       if (!phoneNumber) {
// // //         errors.push({ row: index + 1, error: 'Phone Number is missing' });
// // //         return;
// // //       }

// // //       const { areaCode, stateName, stateCode } =
// // //         calculateStateDetails(phoneNumber);
// // //       const lengthInSeconds = calculateLengthInSeconds(
// // //         row['Length'],
// // //         row['Queue Wait'],
// // //         row['Wrap Up Time'],
// // //       );

// // //       result.push({
// // //         phone_number_dialed: phoneNumber,
// // //         FileName: row['List Name'],
// // //         AreaCode: areaCode,
// // //         StateName: stateName,
// // //         StateCode: stateCode,
// // //         TotalCount: 1, // Placeholder for aggregation logic
// // //         length_in_secs: lengthInSeconds,
// // //         call_dates: row['Date'],
// // //         status_names: row['Status'],
// // //         FileNames: row['List Name'],
// // //       });
// // //     });

// // //     return { result, errors };
// // //   }
// // // }


// // // my second
// // // import { Injectable } from '@nestjs/common';
// // // import { parse } from 'csv-parse/sync';
// // // import { calculateStateDetails, calculateLengthInSeconds } from 'src/utils/functions';

// // // @Injectable()
// // // export class DialingLogsService {
// // //   async processFiles(files: Express.Multer.File[]): Promise<any> {
// // //     const phoneDataMap = new Map<string, any>(); // Map to aggregate phone data
// // //     const errors = [];

// // //     for (const file of files) {
// // //       // Remove UTF-8 BOM if present
// // //       const fileContent = file.buffer.toString().replace(/^\uFEFF/, '');

// // //       // Parse the CSV file
// // //       const data = parse(fileContent, {
// // //         columns: true,
// // //         skip_empty_lines: true,
// // //       });

// // //       data.forEach((row, index) => {
// // //         const phoneNumber = row['Phone Number'] || row['Phone'];
// // //         if (!phoneNumber) {
// // //           errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
// // //           return;
// // //         }

// // //         const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);
// // //         const lengthInSeconds = calculateLengthInSeconds(
// // //           row['Length'],
// // //           row['Queue Wait'],
// // //           row['Wrap Up Time'],
// // //         );

// // //         // If the phone number exists, aggregate data
// // //         if (phoneDataMap.has(phoneNumber)) {
// // //           const existingData = phoneDataMap.get(phoneNumber);

// // //           existingData.FileNames = this.aggregateValues(existingData.FileNames, row['List Name']);
// // //           existingData.status_names = this.aggregateValues(existingData.status_names, row['Status']);
// // //           existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date']);
// // //           existingData.TotalCount += 1;

// // //           // existingData.length_in_secs += lengthInSeconds;
// // //           existingData.length_in_secs = this.aggregateValues(existingData.length_in_secs, lengthInSeconds.toString());
// // //         } else {
// // //           // If the phone number is new, add to the map
// // //           phoneDataMap.set(phoneNumber, {
// // //             phone_number_dialed: phoneNumber,
// // //             FileName: row['List Name'],
// // //             AreaCode: areaCode,
// // //             StateName: stateName,
// // //             StateCode: stateCode,
// // //             TotalCount: 1,
// // //             length_in_secs: lengthInSeconds,
// // //             call_dates: row['Date'],
// // //             status_names: row['Status'],
// // //             FileNames: row['List Name'],
// // //           });
// // //         }
// // //       });
// // //     }

// // //     // Convert the map to an array and return
// // //     const result = Array.from(phoneDataMap.values());
// // //     return { result, errors };
// // //   }

// // //   /**
// // //    * Helper method to aggregate values and avoid duplicates
// // //    */
// // //   private aggregateValues(existingValue: string, newValue: string): string {
// // //     if (!existingValue) return newValue;
// // //     if (!newValue) return existingValue;

// // //     const existingValuesArray = existingValue.split(', ').map((v) => v.trim());
// // //     if (!existingValuesArray.includes(newValue)) {
// // //       return `${existingValue}, ${newValue}`;
// // //     }
// // //     return existingValue;
// // //   }
// // // }


// // // my third

// // import { Injectable } from '@nestjs/common';
// // import { parse } from 'csv-parse/sync';
// // import * as xlsx from 'xlsx';
// // import { calculateLengthInSeconds } from 'src/utils/functions';
// // import { calculateStateDetails } from 'src/dialable_data/utils/state-calculator.util';
// // import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';
// // import { DialingLog } from './entities/dialing-log.entity';
// // import { DataSource } from 'typeorm';

// // @Injectable()
// // export class DialingLogsService {

// //   constructor(private readonly dataSource: DataSource) { }

// //   async processFiles(files: Express.Multer.File[]): Promise<any> {
// //     const phoneDataMap = new Map<string, any>(); // Map to aggregate phone data
// //     const errors = [];

// //     for (const file of files) {
// //       let data: any[] = [];

// //       // Determine file type and parse accordingly
// //       if (file.originalname.endsWith('.csv')) {
// //         // Remove UTF-8 BOM if present
// //         const fileContent = file.buffer.toString().replace(/^\uFEFF/, '');

// //         // Parse the CSV file
// //         data = parse(fileContent, {
// //           columns: true,
// //           skip_empty_lines: true,
// //           relax_column_count: true,
// //         });
// //       } else if (file.originalname.endsWith('.xlsx')) {
// //         // Parse XLSX file
// //         const workbook = xlsx.read(file.buffer, { type: 'buffer' });
// //         const sheetName = workbook.SheetNames[0]; // Use the first sheet
// //         data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
// //       } else {
// //         errors.push({ fileName: file.originalname, error: 'Unsupported file format' });
// //         continue;
// //       }

// //       // Process parsed data
// //       data.forEach((row, index) => {
// //         const phoneNumber = row['Phone Number'] || row['Phone'] || row['phone_number_dialed'];
// //         if (!phoneNumber) {
// //           errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
// //           return;
// //         }

// //         const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);
// //         // const lengthInSeconds = calculateLengthInSeconds(
// //         //   row['Length'],
// //         //   row['Queue Wait'],
// //         //   row['Wrap Up Time'],
// //         // );

// //         // If the phone number exists, aggregate data
// //         if (phoneDataMap.has(phoneNumber)) {
// //           const existingData = phoneDataMap.get(phoneNumber);

// //           existingData.FileNames = this.aggregateValues(existingData.FileNames, file.originalname);
// //           existingData.status_names = this.aggregateValues(existingData.status_names, row['Status'] || row['status']);
// //           existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date'] || row['call_date']);
// //           existingData.TotalCount += 1;

// //           // existingData.length_in_secs = this.aggregateValues(existingData.length_in_secs, lengthInSeconds.toString());
// //           existingData.length_in_secs = this.aggregateValues(existingData.length_in_secs, row['length_in_sec'] || row['Length'] || '');
// //         } else {
// //           // If the phone number is new, add to the map
// //           phoneDataMap.set(phoneNumber, {
// //             phone_number_dialed: phoneNumber,
// //             FileName: row['List Name'],
// //             AreaCode: areaCode,
// //             StateName: stateName,
// //             StateCode: stateCode,
// //             TotalCount: 1,
// //             length_in_secs: row['length_in_sec'] || row['Length'] || 0,
// //             call_dates: row['Date'] || row['call_date'],
// //             status_names: row['Status'] || row['status'],
// //             FileNames: file.originalname,
// //           });
// //         }
// //       });
// //     }

// //     // Convert the map to an array and return
// //     const result = Array.from(phoneDataMap.values());
// //     return { result, errors };

// //     ////////////////////

// //     //   // Combine data with DialableData and save to DialingLog
// //     //   const result = await this.saveDialingLogs(phoneDataMap);
// //     //   return { result, errors };
// //     // }

// //     // private async saveDialingLogs(phoneDataMap: Map<string, any>) {
// //     //   const phoneNumbers = Array.from(phoneDataMap.keys());

// //     //   // Retrieve matching DialableData for these phone numbers
// //     //   const dialableDataRecords = await this.dataSource
// //     //     .getRepository(DialableData)
// //     //     .createQueryBuilder('dialableData')
// //     //     .where('dialableData.number IN (:...phoneNumbers)', { phoneNumbers })
// //     //     .getMany();

// //     //   const dialingLogs = [];
// //     //   for (const phoneNumber of phoneNumbers) {
// //     //     const dialableData = dialableDataRecords.find(
// //     //       (data) => data.number === phoneNumber,
// //     //     );
// //     //     if (dialableData) {
// //     //       const phoneData = phoneDataMap.get(phoneNumber);
// //     //       const dialingLog = this.dataSource.manager.create(DialingLog, {
// //     //         phoneNumberDialed: phoneNumber,
// //     //         fileName: phoneData.FileName,
// //     //         areaCode: dialableData.areaCode,
// //     //         stateName: dialableData.stateName,
// //     //         stateCode: dialableData.stateCode,
// //     //         totalCount: phoneData.TotalCount,
// //     //         lengthInSecs: phoneData.length_in_secs,
// //     //         callDates: phoneData.call_dates,
// //     //         statusNames: phoneData.status_names,
// //     //         fileNames: phoneData.FileNames,
// //     //         dialableData,
// //     //       });
// //     //       dialingLogs.push(dialingLog);
// //     //     }
// //     //   }

// //     //   // Save all logs to the database
// //     //   await this.dataSource.manager.save(DialingLog, dialingLogs);
// //     //   return dialingLogs;
// //     // }

// //     /////////////////////
// //   }

// //   /**
// //    * Helper method to aggregate values and avoid duplicates
// //    */
// //   // private aggregateValues(existingValue: string, newValue: string): string {
// //   //   if (!existingValue) return newValue;
// //   //   if (!newValue) return existingValue;

// //   //   const existingValuesArray = existingValue.split(', ').map((v) => v.trim());
// //   //   if (!existingValuesArray.includes(newValue)) {
// //   //     return `${existingValue}, ${newValue}`;
// //   //   }
// //   //   return existingValue;
// //   // }


// //   private aggregateValues(existingValue: string | null | undefined, newValue: string): string {
// //     // Ensure existingValue is a string; fallback to an empty string if it's null or undefined
// //     const existingValueString = typeof existingValue === 'string' ? existingValue : '';

// //     // Return newValue if existingValue is empty
// //     if (!existingValueString) return newValue;

// //     // Return existingValue if newValue is empty
// //     if (!newValue) return existingValueString;

// //     // Split existingValue into an array, trim values, and check for duplicates
// //     const existingValuesArray = existingValueString.split(',').map((v) => v.trim());
// //     if (!existingValuesArray.includes(newValue)) {
// //       return `${existingValueString}, ${newValue}`; // Append newValue if it's not already included
// //     }

// //     // Return existingValue if newValue is already present
// //     return existingValueString;
// //   }


// //   // private aggregateValues(existingValue: any, newValue: any): string {
// //   //   // Convert values to strings if they are not already strings
// //   //   const existingStr = typeof existingValue === 'string' ? existingValue : '';
// //   //   const newStr = typeof newValue === 'string' ? newValue : '';

// //   //   // If either value is empty, return the non-empty value
// //   //   if (!existingStr) return newStr;
// //   //   if (!newStr) return existingStr;

// //   //   // Split the existing value into an array and check for duplicates
// //   //   const existingValuesArray = existingStr.split(', ').map((v) => v.trim());
// //   //   if (!existingValuesArray.includes(newStr)) {
// //   //     return `${existingStr}, ${newStr}`;
// //   //   }
// //   //   return existingStr;
// //   // }

// // }

// // import { Injectable } from '@nestjs/common';
// // import { parse } from 'csv-parse/sync';
// // import * as xlsx from 'xlsx';
// // import { calculateStateDetails } from 'src/dialable_data/utils/state-calculator.util';
// // import { DataSource } from 'typeorm';

// // @Injectable()
// // export class DialingLogsService {
// //   constructor(private readonly dataSource: DataSource) { }

// //   async processFiles(files: Express.Multer.File[]): Promise<any> {
// //     const phoneDataMap = new Map<string, any>();
// //     const errors = [];

// //     for (const file of files) {
// //       let data: any[] = [];

// //       if (file.originalname.endsWith('.csv')) {
// //         const fileContent = file.buffer.toString().replace(/^\uFEFF/, '');
// //         data = parse(fileContent, {
// //           columns: true,
// //           skip_empty_lines: true,
// //           relax_column_count: true,
// //         });
// //       } else if (file.originalname.endsWith('.xlsx')) {
// //         const workbook = xlsx.read(file.buffer, { type: 'buffer' });
// //         const sheetName = workbook.SheetNames[0];
// //         data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
// //         data = this.convertExcelDates(data);
// //       } else {
// //         errors.push({ fileName: file.originalname, error: 'Unsupported file format' });
// //         continue;
// //       }

// //       data.forEach((row, index) => {
// //         const phoneNumber = row['Phone Number'] || row['Phone'] || row['phone_number_dialed'];
// //         if (!phoneNumber) {
// //           errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
// //           return;
// //         }

// //         const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);

// //         if (phoneDataMap.has(phoneNumber)) {
// //           const existingData = phoneDataMap.get(phoneNumber);
// //           existingData.FileNames = this.aggregateValues(existingData.FileNames, file.originalname);
// //           existingData.status_names = this.aggregateValues(existingData.status_names, row['Status'] || row['status']);
// //           existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date'] || row['call_date']);
// //           existingData.TotalCount += 1;
// //           existingData.length_in_secs = this.aggregateValues(
// //             existingData.length_in_secs,
// //             row['length_in_sec'] || row['Length'] || ''
// //           );
// //         } else {
// //           phoneDataMap.set(phoneNumber, {
// //             phone_number_dialed: phoneNumber,
// //             FileName: row['List Name'],
// //             AreaCode: areaCode,
// //             StateName: stateName,
// //             StateCode: stateCode,
// //             TotalCount: 1,
// //             length_in_secs: row['length_in_sec'] || row['Length'] || 0,
// //             call_dates: row['Date'] || row['call_date'],
// //             status_names: row['Status'] || row['status'],
// //             FileNames: file.originalname,
// //           });
// //         }
// //       });
// //     }

// //     const result = Array.from(phoneDataMap.values());
// //     return { result, errors };
// //   }

// //   /**
// //    * Converts Excel serial date numbers to proper date-time strings in the data array.
// //    */
// //   private convertExcelDates(data: any[]): any[] {
// //     return data.map((row) => {
// //       for (const key in row) {
// //         if (row.hasOwnProperty(key) && typeof row[key] === 'number' && key.toLowerCase().includes('date')) {
// //           row[key] = this.excelDateToJSDate(row[key]);
// //         }
// //       }
// //       return row;
// //     });
// //   }

// //   /**
// //    * Converts an Excel serial date to a JavaScript Date object and formats it as a string.
// //    */
// //   private excelDateToJSDate(serial: number): string {
// //     const utcDays = Math.floor(serial - 25569); // Excel epoch starts on 1900-01-01
// //     const utcValue = utcDays * 86400; // Seconds in a day
// //     const fractionalDay = serial - Math.floor(serial);
// //     const totalSeconds = Math.floor(fractionalDay * 86400);
// //     const date = new Date((utcValue + totalSeconds) * 1000);
// //     return date.toISOString().replace('T', ' ').split('.')[0]; // Format as "YYYY-MM-DD HH:mm:ss"
// //   }

// //   private aggregateValues(existingValue: string | null | undefined, newValue: string): string {
// //     const existingValueString = typeof existingValue === 'string' ? existingValue : '';
// //     if (!existingValueString) return newValue;
// //     if (!newValue) return existingValueString;

// //     const existingValuesArray = existingValueString.split(',').map((v) => v.trim());
// //     if (!existingValuesArray.includes(newValue)) {
// //       return `${existingValueString}, ${newValue}`;
// //     }
// //     return existingValueString;
// //   }
// // }


// import { Injectable } from '@nestjs/common';
// import { parse } from 'csv-parse/sync';
// import * as xlsx from 'xlsx';
// import { calculateStateDetails } from 'src/dialable_data/utils/state-calculator.util';
// import { DataSource } from 'typeorm';

// @Injectable()
// export class DialingLogsService {
//   constructor(private readonly dataSource: DataSource) { }

//   async processFiles(files: Express.Multer.File[]): Promise<any> {
//     const phoneDataMap = new Map<string, any>();
//     const errors = [];

//     for (const file of files) {
//       let data: any[] = [];

//       if (file.originalname.endsWith('.csv')) {
//         const fileContent = file.buffer.toString().replace(/^﻿/, '');
//         data = parse(fileContent, {
//           columns: true,
//           skip_empty_lines: true,
//           relax_column_count: true,
//         });
//       } else if (file.originalname.endsWith('.xlsx')) {
//         const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
//         data = this.convertExcelDates(data);
//       } else {
//         errors.push({ fileName: file.originalname, error: 'Unsupported file format' });
//         continue;
//       }

//       data.forEach((row, index) => {
//         const phoneNumber = (row['Phone Number'] || row['Phone'] || row['phone_number_dialed'])?.toString();
//         if (!phoneNumber) {
//           errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
//           return;
//         }

//         const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);

//         if (phoneDataMap.has(phoneNumber)) {
//           const existingData = phoneDataMap.get(phoneNumber);
//           existingData.FileNames = this.aggregateValues(existingData.FileNames, file.originalname);
//           existingData.status_names = this.aggregateValues(existingData.status_names, row['Status'] || row['status']);
//           existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date'] || row['call_date']);
//           existingData.TotalCount += 1;
//           existingData.length_in_secs = this.aggregateValues(
//             existingData.length_in_secs,
//             (row['length_in_sec'] || row['Length'] || '').toString()
//           );
//         } else {
//           phoneDataMap.set(phoneNumber, {
//             phone_number_dialed: phoneNumber,
//             FileName: row['List Name'],
//             AreaCode: areaCode,
//             StateName: stateName,
//             StateCode: stateCode,
//             TotalCount: 1,
//             length_in_secs: (row['length_in_sec'] || row['Length'] || 0).toString(),
//             call_dates: row['Date'] || row['call_date'],
//             status_names: row['Status'] || row['status'],
//             FileNames: file.originalname,
//           });
//         }
//       });
//     }

//     const result = Array.from(phoneDataMap.values());
//     return { result, errors };
//   }

//   /**
//    * Converts Excel serial date numbers to proper date-time strings in the data array.
//    */
//   private convertExcelDates(data: any[]): any[] {
//     return data.map((row) => {
//       for (const key in row) {
//         if (row.hasOwnProperty(key) && typeof row[key] === 'number' && key.toLowerCase().includes('date')) {
//           row[key] = this.excelDateToJSDate(row[key]);
//         }
//       }
//       return row;
//     });
//   }

//   /**
//    * Converts an Excel serial date to a JavaScript Date object and formats it as a string.
//    */
//   private excelDateToJSDate(serial: number): string {
//     const utcDays = Math.floor(serial - 25569); // Excel epoch starts on 1900-01-01
//     const utcValue = utcDays * 86400; // Seconds in a day
//     const fractionalDay = serial - Math.floor(serial);
//     const totalSeconds = Math.floor(fractionalDay * 86400);
//     const date = new Date((utcValue + totalSeconds) * 1000);
//     return date.toISOString().replace('T', ' ').split('.')[0]; // Format as "YYYY-MM-DD HH:mm:ss"
//   }

//   private aggregateValues(existingValue: string | null | undefined, newValue: string): string {
//     const existingValueString = typeof existingValue === 'string' ? existingValue : '';
//     if (!existingValueString) return newValue;
//     if (!newValue) return existingValueString;

//     const existingValuesArray = existingValueString.split(',').map((v) => v.trim());
//     if (!existingValuesArray.includes(newValue)) {
//       return `${existingValueString}, ${newValue}`;
//     }
//     return existingValueString;
//   }
// }


// last

import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import * as xlsx from 'xlsx';
import { calculateStateDetails } from 'src/dialable_data/utils/state-calculator.util';
import { DataSource, Repository } from 'typeorm';
import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';
import { DialingLog } from './entities/dialing-log.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DialingLogsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(DialingLog)
    private secondRepository: Repository<DialingLog>,

    @InjectRepository(DialableData)
    private firstRepository: Repository<DialableData>,

  ) { }

  async processFileExcel(files: Express.Multer.File[]): Promise<any> {
    const phoneDataMap = new Map<string, any>();
    const errors = [];

    for (const file of files) {
      let data: any[] = [];

      if (file.originalname.endsWith('.csv')) {
        const fileContent = file.buffer.toString().replace(/^﻿/, '');
        data = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          relax_column_count: true,
        });
      } else if (file.originalname.endsWith('.xlsx')) {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        data = this.convertExcelDates(data);
      } else {
        errors.push({ fileName: file.originalname, error: 'Unsupported file format' });
        continue;
      }

      data.forEach((row, index) => {
        const phoneNumber = (row['Phone Number'] || row['Phone'] || row['phone_number_dialed'])?.toString();
        if (!phoneNumber) {
          errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
          return;
        }

        const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);

        if (phoneDataMap.has(phoneNumber)) {
          const existingData = phoneDataMap.get(phoneNumber);

          // Append new data to the existing comma-separated strings
          existingData.FileNames = this.aggregateValues(existingData.FileNames, file.originalname, true);
          existingData.status_names = this.aggregateValues(existingData.status_names, row['Status'] || row['status']);
          existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date'] || row['call_date']);
          existingData.length_in_secs = this.aggregateValues(
            existingData.length_in_secs,
            (row['length_in_sec'] || row['Length'] || '0').toString()
          );
          existingData.TotalCount += 1;
        } else {
          phoneDataMap.set(phoneNumber, {
            phone_number_dialed: phoneNumber,
            FileNames: file.originalname,
            AreaCode: areaCode,
            StateName: stateName,
            StateCode: stateCode,
            TotalCount: 1,
            length_in_secs: (row['length_in_sec'] || row['Length'] || '0').toString(),
            call_dates: row['Date'] || row['call_date'] || '',
            status_names: row['Status'] || row['status'] || '',
          });
        }
      });
    }

    const result = Array.from(phoneDataMap.values());
    return { result, errors };
  }

  // async processFiles(files: Express.Multer.File[]): Promise<any> {
  //   const phoneDataMap = new Map<string, any>();
  //   const errors = [];

  //   for (const file of files) {
  //     let data: any[] = [];

  //     if (file.originalname.endsWith('.csv')) {
  //       const fileContent = file.buffer.toString().replace(/^﻿/, '');
  //       data = parse(fileContent, {
  //         columns: true,
  //         skip_empty_lines: true,
  //         relax_column_count: true,
  //       });
  //     } else if (file.originalname.endsWith('.xlsx')) {
  //       const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  //       const sheetName = workbook.SheetNames[0];
  //       data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  //       data = this.convertExcelDates(data);
  //     } else {
  //       errors.push({ fileName: file.originalname, error: 'Unsupported file format' });
  //       continue;
  //     }

  //     for (const row of data) {
  //       const phoneNumber = (row['Phone Number'] || row['Phone'] || row['phone_number_dialed'])?.toString();

  //       if (!phoneNumber) {
  //         errors.push({ fileName: file.originalname, error: 'Phone Number is missing' });
  //         continue;
  //       }

  //       const existingData = phoneDataMap.get(phoneNumber) || {
  //         phone_number_dialed: phoneNumber,
  //         FileNames: '',
  //         status_names: '',
  //         call_dates: '',
  //         length_in_secs: '',
  //         TotalCount: 0,
  //       };

  //       existingData.FileNames = this.aggregateValues(existingData.FileNames, file.originalname, true);
  //       existingData.status_names = this.aggregateValues(existingData.status_names, row['Status'] || row['status']);
  //       existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date'] || row['call_date']);
  //       existingData.length_in_secs = this.aggregateValues(
  //         existingData.length_in_secs,
  //         (row['length_in_sec'] || row['Length'] || '0').toString()
  //       );
  //       existingData.TotalCount += 1;

  //       phoneDataMap.set(phoneNumber, existingData);
  //     }
  //   }

  //   // Save each entry in DialingLog after merging with DialableData
  //   const results = [];
  //   for (const phoneData of phoneDataMap.values()) {
  //     try {
  //       // Find related area code data from DialableData
  //       const areaCodeData = await this.firstRepository.findOne({
  //         where: { number: phoneData.phone_number_dialed },
  //       });

  //       if (!areaCodeData) {
  //         errors.push({ phoneNumber: phoneData.phone_number_dialed, error: 'No area code data found' });
  //         continue;
  //       }

  //       const dialingLog = this.secondRepository.create({
  //         phoneNumberDialed: phoneData.phone_number_dialed,
  //         totalCount: phoneData.TotalCount,
  //         lengthInSecs: (phoneData.length_in_secs).toString(),
  //         callDates: phoneData.call_dates,
  //         statusNames: phoneData.status_names,
  //         fileNames: phoneData.FileNames,
  //         areaCode: areaCodeData.areaCode,
  //         stateName: areaCodeData.stateName,
  //         stateCode: areaCodeData.stateCode,
  //         createdBy: phoneData.createdBy || 'system '
  //       });

  //       const savedLog = await this.secondRepository.save(dialingLog);
  //       results.push(savedLog);
  //     } catch (error) {
  //       console.error(`Failed to save data for phone number ${phoneData.phone_number_dialed}:`, error.message);
  //       errors.push({ phoneNumber: phoneData.phone_number_dialed, error: error.message });
  //     }
  //   }

  //   return { results, errors };
  // }


  // async saveData(phoneData: any): Promise<DialingLog> {
  //   try {
  //     const dialableData = await this.firstRepository.findOne({
  //       where: { number: phoneData.phone_number_dialed },
  //     });

  //     if (!dialableData) {
  //       throw new Error('Dialable data not found for this phone number.');
  //     }

  //     const dialingLog = this.secondRepository.create({
  //       phoneNumberDialed: phoneData.phone_number_dialed,
  //       totalCount: phoneData.TotalCount,
  //       lengthInSecs: phoneData.length_in_secs,
  //       callDates: phoneData.call_dates,
  //       statusNames: phoneData.status_names,
  //       fileNames: phoneData.FileNames,
  //       stateName: dialableData.stateName,
  //       stateCode: dialableData.stateCode,
  //       areaCode: dialableData.areaCode,
  //     });

  //     return await this.secondRepository.save(dialingLog);
  //   } catch (error) {
  //     console.error('Error saving dialing log:', error.message);
  //     throw error;
  //   }
  // }


  async processFiles(files: Express.Multer.File[]): Promise<any> {
    // Step 1: Use processFileExcel to process and extract phone data
    const { result: phoneDataArray, errors: processingErrors } = await this.processFileExcel(files);

    const phoneDataMap = new Map<string, any>();
    for (const phoneData of phoneDataArray) {
      phoneDataMap.set(phoneData.phone_number_dialed, phoneData);
    }

    // Step 2: Compare with the database (DialableData) and save merged data into DialingLog
    const errors = [...processingErrors]; // Include any errors from processFileExcel
    const results = [];

    for (const phoneData of phoneDataMap.values()) {
      try {
        // Fetch related area code data from the DialableData repository
        const areaCodeData = await this.firstRepository.findOne({
          where: { number: phoneData.phone_number_dialed },
        });

        if (!areaCodeData) {
          errors.push({
            phoneNumber: phoneData.phone_number_dialed,
            error: 'No area code data found',
          });
          continue;
        }

        // Create the DialingLog entry
        const dialingLog = this.secondRepository.create({
          phoneNumberDialed: phoneData.phone_number_dialed,
          totalCount: phoneData.TotalCount,
          lengthInSecs: phoneData.length_in_secs.toString(),
          callDates: phoneData.call_dates,
          statusNames: phoneData.status_names,
          fileNames: phoneData.FileNames,
          areaCode: areaCodeData.areaCode,
          stateName: areaCodeData.stateName,
          stateCode: areaCodeData.stateCode,
          createdBy: phoneData.createdBy || 'system',
        });

        // Save the entry to the database
        const savedLog = await this.secondRepository.save(dialingLog);
        results.push(savedLog);
      } catch (error) {
        console.error(
          `Failed to save data for phone number ${phoneData.phone_number_dialed}:`,
          error.message
        );
        errors.push({
          phoneNumber: phoneData.phone_number_dialed,
          error: error.message,
        });
      }
    }

    // Return the results and errors
    return { results, errors };
  }



  /**
   * Converts Excel serial date numbers to proper date-time strings in the data array.
   */
  private convertExcelDates(data: any[]): any[] {
    return data.map((row) => {
      for (const key in row) {
        if (row.hasOwnProperty(key) && typeof row[key] === 'number' && key.toLowerCase().includes('date')) {
          row[key] = this.excelDateToJSDate(row[key]);
        }
      }
      return row;
    });
  }

  /**
   * Converts an Excel serial date to a JavaScript Date object and formats it as a string.
   */
  private excelDateToJSDate(serial: number): string {
    const utcDays = Math.floor(serial - 25569); // Excel epoch starts on 1900-01-01
    const utcValue = utcDays * 86400; // Seconds in a day
    const fractionalDay = serial - Math.floor(serial);
    const totalSeconds = Math.floor(fractionalDay * 86400);
    const date = new Date((utcValue + totalSeconds) * 1000);
    return date.toISOString().replace('T', ' ').split('.')[0]; // Format as "YYYY-MM-DD HH:mm:ss"
  }

  // /**
  //  * Aggregates values into a comma-separated string.
  //  */
  // private aggregateValues(existingValue: string | null | undefined, newValue: string): string {
  //   const existingValueString = typeof existingValue === 'string' ? existingValue : '';
  //   if (!existingValueString) return newValue;
  //   if (!newValue) return existingValueString;

  //   return `${existingValueString}, ${newValue}`;
  // }

  /**
 * Aggregates values into a comma-separated string.
 * - Ensures `FileNames` avoids repetition.
 * - Other fields can include repeated values.
 */
  private aggregateValues(existingValue: string | null | undefined, newValue: string, isFileName: boolean = false): string {
    const existingValueString = existingValue || '';
    if (isFileName) {
      // Avoid repetition for FileNames
      const existingValuesArray = existingValueString.split(',').map((v) => v.trim());
      if (!existingValuesArray.includes(newValue.trim())) {
        return existingValueString ? `${existingValueString}, ${newValue}` : newValue;
      }
      return existingValueString;
    }
    // Allow repetition for other fields
    return existingValueString ? `${existingValueString}, ${newValue}` : newValue;
  }





}





