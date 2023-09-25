import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
