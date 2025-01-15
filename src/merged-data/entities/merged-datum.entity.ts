import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MergedData {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    stateName: string;

    @Column({ nullable: true })
    stateCode: string;

    @Column({ nullable: true })
    areaCode: string;

    @Column({ nullable: true })
    totalCount: number;

    @Column({ nullable: true })
    lengthInSecs: string;

    @Column({ nullable: true })
    callDates: string;

    @Column({ nullable: true })
    statusNames: string;

    @Column({ nullable: true })
    fileNames: string;

    @Column({ nullable: true })
    dnc: string;

    @Column({ nullable: true })
    dncFileName: string;

}
