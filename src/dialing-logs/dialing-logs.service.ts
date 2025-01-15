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
            error: 'No phone number data found',
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





