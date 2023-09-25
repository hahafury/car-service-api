import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'Joe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Johnson',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  surname: string;

  // credentials
  @ApiProperty({
    example: 'john.doe@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+384405551234',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'myStrongPassword',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'myStrongPassword',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  confirmPassword: string;
}
