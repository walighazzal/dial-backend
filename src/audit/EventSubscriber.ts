import { Injectable } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  UpdateEvent,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<any> {
  beforeInsert(event: InsertEvent<any>): Promise<any> | void {
    console.log('event.entity');
    console.log(event.entity);
  }
  beforeUpdate(event: UpdateEvent<any>) {
    event.entity.updatedAt = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
  }
}
