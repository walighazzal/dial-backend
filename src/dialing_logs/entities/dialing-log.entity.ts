import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DialingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'phone_number_dialed',
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  phoneNumberDialed: string;

  @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ name: 'area_code', type: 'varchar', length: 10, nullable: true })
  areaCode: string;

  @Column({ name: 'state_name', type: 'varchar', length: 100, nullable: true })
  stateName: string;

  @Column({ name: 'state_code', type: 'varchar', length: 10, nullable: true })
  stateCode: string;

  @Column({ name: 'total_count', type: 'int', default: 1 })
  totalCount: number;

  @Column({
    name: 'length_in_secs',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  lengthInSecs: string;

  @Column({ name: 'call_dates', type: 'text', nullable: true })
  callDates: string; // Stores comma-separated dates

  @Column({ name: 'status_names', type: 'text', nullable: true })
  statusNames: string; // Stores comma-separated statuses

  @Column({ name: 'file_names', type: 'text', nullable: true })
  fileNames: string; // Stores comma-separated file names

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
