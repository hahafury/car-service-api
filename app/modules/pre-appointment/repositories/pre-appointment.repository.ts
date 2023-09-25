import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PreAppointmentEntity } from '@app/modules/pre-appointment/entities';

@Injectable()
export class PreAppointmentRepository extends Repository<PreAppointmentEntity> {
  constructor(private dataSource: DataSource) {
    super(PreAppointmentEntity, dataSource.createEntityManager());
  }
}
