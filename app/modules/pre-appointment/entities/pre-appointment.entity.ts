import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/common/base';

@Entity('pre_appointment')
export class PreAppointmentEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  carBrand: string;

  @Column({ type: 'integer' })
  carManufactureYear: number;

  @Column({ type: 'integer' })
  carMileage: number;

  @Column({ type: 'varchar' })
  carNumber: string;

  @Column({ type: 'varchar' })
  reason: string;

  @Column({ type: Date })
  commencementAt: Date;
}
