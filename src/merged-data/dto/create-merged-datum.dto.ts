import { IsNumber, IsString } from "class-validator";

export class CreateMergedDatumDto {

    @IsString()
    phoneNumber: string;

    @IsNumber()
    totalCount: number;

    @IsString()
    lengthInSecs: string;

    @IsString()
    callDates: string;

    @IsString()
    statusNames: string;

    @IsString()
    fileNames: string;

    @IsString()
    areaCode: string;

    @IsString()
    stateCode: string;

    @IsString()
    stateName: string;

    @IsString()
    dncFileName: string;
}
