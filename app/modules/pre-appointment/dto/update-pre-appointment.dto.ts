import { PartialType } from '@nestjs/swagger';
import { CreatePreAppointmentDto } from '@app/modules/pre-appointment/dto/create-pre-appointment.dto';

export class UpdatePreAppointmentDto extends PartialType(
  CreatePreAppointmentDto,
) {}
