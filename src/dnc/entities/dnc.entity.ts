import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dnc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
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
  areaCode: string;

  @Column({ nullable: true })
  stateCode: string;

  @Column({ nullable: true })
  stateName: string;

  @Column({ default: 'DNC' })
  dnc: string;

  @Column()
  dncFileName: string;

  @Column()
  sessionId: string;
}
