import { Audit } from 'src/audit/audit.entity';
import { RefRole } from 'src/ref-data/entities/ref-data.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users extends Audit {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  roleId: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true, type: 'timestamp' })
  resetPasswordTokenExpiry: Date;

  @ManyToOne(() => RefRole, (refRole) => refRole.users)
  @JoinColumn({ name: 'roleId' })
  role: RefRole;
}
