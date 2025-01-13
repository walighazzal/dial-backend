import { Audit } from 'src/audit/audit.entity';
import { DialingLog } from 'src/dialing-logs/entities/dialing-log.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DialableData extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  stateName: string;

  @Column()
  stateCode: string;

  @Column()
  areaCode: string;

  // @OneToMany(() => DialingLog, (log) => log.dialableData)
  // dialingLogs: DialingLog[];
}
