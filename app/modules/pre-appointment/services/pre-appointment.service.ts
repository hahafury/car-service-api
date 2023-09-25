import {
  Body,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreatePreAppointmentDto,
  UpdatePreAppointmentDto,
} from '@app/modules/pre-appointment/dto';
import { PreAppointmentRepository } from '@app/modules/pre-appointment/repositories/pre-appointment.repository';
import { PreAppointmentEntity } from '@app/modules/pre-appointment/entities';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class PreAppointmentService {
  constructor(private preAppointmentRepository: PreAppointmentRepository) {}
  createPreAppointment(
    preAppointmentData: CreatePreAppointmentDto,
  ): Promise<PreAppointmentEntity> {
    return this.preAppointmentRepository.save(preAppointmentData);
  }

  getPreAppointment(id: number): Promise<PreAppointmentEntity | null> {
    return this.preAppointmentRepository.findOneBy({ id: id });
  }

  getPreAppointments(): Promise<PreAppointmentEntity[]> {
    return this.preAppointmentRepository.find();
  }

  updatePreAppointment(
    id: number,
    updatePreAppointmentData: Omit<UpdatePreAppointmentDto, 'id'>,
  ): Promise<UpdateResult> {
    return this.preAppointmentRepository.update(
      { id: id },
      updatePreAppointmentData,
    );
  }

  deletePreAppointment(id: number): Promise<DeleteResult> {
    return this.preAppointmentRepository.delete({ id: id });
  }
}
