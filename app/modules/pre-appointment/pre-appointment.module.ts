import { Module } from '@nestjs/common';
import { PreAppointmentRepository } from '@app/modules/pre-appointment/repositories/pre-appointment.repository';
import { PreAppointmentService } from '@app/modules/pre-appointment/services';
import { PreAppointmentController } from '@app/modules/pre-appointment/controllers';

@Module({
  providers: [PreAppointmentService, PreAppointmentRepository],
  controllers: [PreAppointmentController],
})
export class PreAppointmentModule {}
