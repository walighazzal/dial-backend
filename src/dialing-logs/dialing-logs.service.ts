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

@Injectable()
export class DialingLogsService {
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
        const phoneNumber = row['Phone Number'] || row['Phone'];
        if (!phoneNumber) {
          errors.push({ fileName: file.originalname, row: index + 1, error: 'Phone Number is missing' });
          return;
        }

        const { areaCode, stateName, stateCode } = calculateStateDetails(phoneNumber);
        const lengthInSeconds = calculateLengthInSeconds(
          row['Length'],
          row['Queue Wait'],
          row['Wrap Up Time'],
        );

        // If the phone number exists, aggregate data
        if (phoneDataMap.has(phoneNumber)) {
          const existingData = phoneDataMap.get(phoneNumber);

          existingData.FileNames = this.aggregateValues(existingData.FileNames, row['List Name']);
          existingData.status_names = this.aggregateValues(existingData.status_names, row['Status']);
          existingData.call_dates = this.aggregateValues(existingData.call_dates, row['Date']);
          existingData.TotalCount += 1;

          existingData.length_in_secs = this.aggregateValues(existingData.length_in_secs, lengthInSeconds.toString());
        } else {
          // If the phone number is new, add to the map
          phoneDataMap.set(phoneNumber, {
            phone_number_dialed: phoneNumber,
            FileName: row['List Name'],
            AreaCode: areaCode,
            StateName: stateName,
            StateCode: stateCode,
            TotalCount: 1,
            length_in_secs: lengthInSeconds,
            call_dates: row['Date'],
            status_names: row['Status'],
            FileNames: row['List Name'],
          });
        }
      });
    }

    // Convert the map to an array and return
    const result = Array.from(phoneDataMap.values());
    return { result, errors };
  }

  /**
   * Helper method to aggregate values and avoid duplicates
   */
  private aggregateValues(existingValue: string, newValue: string): string {
    if (!existingValue) return newValue;
    if (!newValue) return existingValue;

    const existingValuesArray = existingValue.split(', ').map((v) => v.trim());
    if (!existingValuesArray.includes(newValue)) {
      return `${existingValue}, ${newValue}`;
    }
    return existingValue;
  }
}
