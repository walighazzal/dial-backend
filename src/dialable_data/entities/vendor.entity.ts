import { Audit } from "src/audit/audit.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vendor extends Audit {
  @PrimaryGeneratedColumn('uuid')
  vendorId: string;
  
  @Column()
  name: string;
}
