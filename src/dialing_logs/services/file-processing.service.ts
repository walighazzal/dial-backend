import { Injectable } from '@nestjs/common';
import {
  calculateStateDetails,
  calculateLengthInSeconds,
} from '../utils/phone-number.utils';
import * as fs from 'fs';

@Injectable()
export class FileProcessingService {
  processData(data: any[]): any {
    const result = [];
    const errors = [];

    data.forEach((row, index) => {
      const phoneNumber = row['Phone Number'] || row['Phone'];
      if (!phoneNumber) {
        errors.push({ row: index + 1, error: 'Phone Number is missing' });
        return;
      }

      const { areaCode, stateName, stateCode } =
        calculateStateDetails(phoneNumber);
      const lengthInSeconds = calculateLengthInSeconds(
        row['Length'],
        row['Queue Wait'],
        row['Wrap Up Time'],
      );

      result.push({
        phone_number_dialed: phoneNumber,
        FileName: row['List Name'],
        AreaCode: areaCode,
        StateName: stateName,
        StateCode: stateCode,
        TotalCount: 1, // Placeholder for aggregation logic
        length_in_secs: lengthInSeconds,
        call_dates: row['Date'],
        status_names: row['Status'],
        FileNames: row['List Name'],
      });
    });

    return { result, errors };
  }
}
