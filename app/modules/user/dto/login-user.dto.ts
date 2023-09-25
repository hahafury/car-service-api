import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  password: string;
}
