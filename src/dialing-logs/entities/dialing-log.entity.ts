import { Audit } from "src/audit/audit.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class DialingLog extends Audit {

    @PrimaryGeneratedColumn()
    dialingLogId: string;

    @Column()
    phoneNumberDialed: string;

    @Column()
    fileName: string;

    @Column()
    areaCode: string;

    @Column()
    stateName: string;

    @Column()
    stateCode: string;

    @Column()
    totalCount: number;

    @Column()
    lengthInSecs: number;

    @Column()
    callDates: string;

    @Column()
    statusNames: string;

    @Column()
    fileNames: string;

}