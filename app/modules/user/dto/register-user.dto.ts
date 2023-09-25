import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'Joe',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'Johnson',
    required: true,
  })
  surname: string;

  // credentials
  @ApiProperty({
    example: 'john.doe@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '+384405551234',
    required: true,
  })
  phone: string;

  @ApiProperty({
    example: 'myStrongPassword',
    required: true,
  })
  password: string;

  @ApiProperty({
    example: 'myStrongPassword',
    required: true,
  })
  confirmPassword: string;
}
