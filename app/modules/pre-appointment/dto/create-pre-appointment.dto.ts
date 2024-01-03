import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreatePreAppointmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  carBrand: string;

  @IsNotEmpty()
  @IsNumber()
  carManufactureYear: number;

  @IsNotEmpty()
  @IsNumber()
  carMileage: number;

  @IsNotEmpty()
  @IsString()
  carNumber: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsDate()
  commencementAt: Date;
}
