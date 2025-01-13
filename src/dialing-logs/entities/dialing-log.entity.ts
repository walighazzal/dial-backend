import { Audit } from 'src/audit/audit.entity';
import { DialableData } from 'src/dialable_data/entities/dialable-data.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DialingLog extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumberDialed: string;

  // @Column()
  // fileName: string;

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

  // @ManyToOne(() => DialableData, (data) => data.dialingLogs)
  // dialableData: DialableData;
}
