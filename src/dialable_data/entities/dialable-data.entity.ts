import { Audit } from 'src/audit/audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DialableData extends Audit {
  @PrimaryGeneratedColumn('uuid')
  dialableDataId: string;

  @Column()
  number: string;

  @Column()
  stateName: string;

  @Column()
  stateCode: string;

  @Column()
  areaCode: string;
}
