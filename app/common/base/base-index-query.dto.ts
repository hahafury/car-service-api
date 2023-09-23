import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformStringToNumber } from '@app/common/transforms';

export class BaseIndexQueryDto {
  @Transform(transformStringToNumber)
  @IsOptional()
  @IsNumber()
  public readonly limit?: number | null;

  @Transform(transformStringToNumber)
  @IsOptional()
  @IsNumber()
  public readonly page?: number | null;
}
