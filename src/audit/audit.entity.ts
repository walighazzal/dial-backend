import { AfterSoftRemove, AfterUpdate, Column } from 'typeorm';

export class Audit {
  @Column()
  createdBy: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;

  @AfterUpdate()
  updateTimestamp() {
    this.updatedAt = new Date().toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
    });
  }

  @AfterSoftRemove()
  removeTimestamp() {
    this.updatedAt = new Date().toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
    });
  }
}
