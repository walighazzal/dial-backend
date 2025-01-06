import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UploadResponseDto } from './dtos/upload-response.dto';
import { parseFile } from './utils/file-parser.util';
import { calculateStateDetails } from './utils/state-calculator.util';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { DialableData } from './entities/dialable-data.entity';

@Injectable()
export class DialableDataService {

  constructor(
    private dataSource: DataSource
) { }

  async processVendor(vendorName: string, createdBy: string) {
    // Logic to create or fetch the vendor
    const vendor = await this.createVendor({name:vendorName, createdBy: createdBy});
    return { id: vendor.vendorId, name: vendorName };
  }

  // async processFile(
  //   file: Express.Multer.File,
  //   vendorId: string,
  //   createdBy: string,
  // ) {
  //   const parsedData = parseFile(file);
  //   const uniqueNumbers = new Set<string>();
  //   const duplicates = new Set<string>();

  //   parsedData.forEach((row) => {      
  //     if (uniqueNumbers.has(row.phone_number)) {
  //       duplicates.add(row.phone_number);
  //     } else {
  //       uniqueNumbers.add(row.phone_number);
  //     }
  //   });

  //   const stateDetails = Array.from(uniqueNumbers).map((phone_number) => ({
  //     phone_number,
  //     ...calculateStateDetails(phone_number),
  //   }
  // ));

  // console.log(stateDetails);

  // stateDetails.map((data)=> {
  //   this.dataSource.manager.save(DialableData, {
  //     createdBy: createdBy,
  //     stateName: data.stateName,
  //     stateCode: data.stateCode,
  //     areaCode: data.areaCode,
  //     number: data.phone_number
  // })  
  // })

    

  //   // Save to dialable-data entity 
    

  //   // Return result
  //   return {
  //     uploadId: 'generated-upload-id',
  //     // newRecords: stateDetails.length - duplicates.size,
  //     newRecords: stateDetails.length,
  //     duplicateRecords: duplicates.size,
      
  //   };
  // }



  

  async createVendor(createVendorDto: CreateVendorDto) {
    return this.dataSource.manager.save(Vendor, createVendorDto);
    // return { vendorId: 'new-vendor-id', ...createVendorDto };
  }

  async processFiles(
    files: Express.Multer.File[],
    vendorId: string,
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
      // newRecords: stateDetails.length - duplicates.size,
      newRecords: stateDetails.length,
      duplicateRecords: duplicates.size,
      
    };
  


}

}
