import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as xlsx from 'xlsx';
import { parse } from 'csv-parse/sync';
import { Dnc } from './entities/dnc.entity';
import { DialingLog } from 'src/dialing-logs/entities/dialing-log.entity';
import { Response } from 'express';

@Injectable()
export class DncService {
  constructor(
    @InjectRepository(Dnc) private readonly dncRepository: Repository<Dnc>,
    @InjectRepository(DialingLog)
    private readonly dialingLogRepository: Repository<DialingLog>,
  ) {}

  async processDncFile(
    file: Express.Multer.File,
    sessionId: string,
  ): Promise<any> {
    let dncData: any[] = [];

    // Parse the uploaded file
    if (file.originalname.endsWith('.csv')) {
      const fileContent = file.buffer.toString().replace(/^﻿/, '');
      dncData = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
      });
    } else if (file.originalname.endsWith('.xlsx')) {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      dncData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      throw new Error(
        'Unsupported file format. Only CSV and XLSX files are allowed.',
      );
    }

    // Extract phone numbers
    const dncPhoneNumbers = dncData
      .map(
        (row) =>
          row['Phone Number'] || row['Phone#'] || row['phone_number_dialed'],
      )
      .filter(Boolean);

    if (dncPhoneNumbers.length === 0) {
      throw new Error('No valid phone numbers found in the DNC file.');
    }

    // Query DialingLog for matching phone numbers
    const matchedResults = await this.dialingLogRepository
      .createQueryBuilder('dialingLog')
      .where('dialingLog.phoneNumberDialed IN (:...dncPhoneNumbers)', {
        dncPhoneNumbers,
      })
      .getMany();

    // Prepare and save matched results to DNC entity
    const dncEntries = matchedResults.map((entry) => {
      return this.dncRepository.create({
        phoneNumber: entry.phoneNumberDialed,
        totalCount: entry.totalCount,
        lengthInSecs: entry.lengthInSecs,
        callDates: entry.callDates,
        statusNames: entry.statusNames,
        fileNames: entry.fileNames,
        areaCode: entry.areaCode,
        stateCode: entry.stateCode,
        stateName: entry.stateName,
        dncFileName: file.originalname,
        sessionId: sessionId,
      });
    });

    // Save to the DNC tables
    await this.dncRepository.save(dncEntries);

    return {
      message: 'DNC file processed successfully.',
      savedCount: dncEntries.length,
      dncEntries,
    };
  }
}
