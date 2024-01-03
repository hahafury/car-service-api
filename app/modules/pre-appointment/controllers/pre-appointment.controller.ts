import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreatePreAppointmentDto,
  UpdatePreAppointmentDto,
} from '@app/modules/pre-appointment/dto';
import { PreAppointmentService } from '@app/modules/pre-appointment/services';
import { PreAppointmentEntity } from '@app/modules/pre-appointment/entities';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Message } from '@app/common/types';

@Controller('pre-appointment')
export class PreAppointmentController {
  constructor(private preAppointmentService: PreAppointmentService) {}
  @Post('')
  async createPreAppointment(
    @Body() preAppointmentData: CreatePreAppointmentDto,
  ): Promise<Message> {
    const { id } =
      await this.preAppointmentService.createPreAppointment(preAppointmentData);

    return {
      message: `Pre appointment with id ${id} was successfully created`,
    };
  }

  @Get('one/:id')
  async getPreAppointment(
    @Param('id') id: number,
  ): Promise<PreAppointmentEntity | null> {
    const preAppointment: PreAppointmentEntity =
      await this.preAppointmentService.getPreAppointment(id);

    if (!preAppointment) {
      throw new NotFoundException(`Pre appointment with id ${id} not found`);
    }

    return preAppointment;
  }

  @Get('all')
  getPreAppointments(): Promise<PreAppointmentEntity[]> {
    return this.preAppointmentService.getPreAppointments();
  }

  @Put('one/:id')
  async updatePreAppointment(
    @Body() preAppointmentData: UpdatePreAppointmentDto,
    @Param('id') id: number,
  ): Promise<Message> {
    const { affected } = await this.preAppointmentService.updatePreAppointment(
      id,
      preAppointmentData,
    );

    if (affected === 0) {
      throw new NotFoundException(`Pre-appointment with id ${id} not found`);
    }

    return {
      message: `Pre-appointment successfully with id ${id} updated`,
    };
  }

  @Delete('one/:id')
  async deletePreAppointment(@Param('id') id: number): Promise<Message> {
    const { affected } =
      await this.preAppointmentService.deletePreAppointment(id);

    if (affected === 0) {
      throw new NotFoundException(`Pre-appointment with id ${id} not found`);
    }

    return {
      message: `Pre-appointment with id ${id} successfully deleted`,
    };
  }
}
