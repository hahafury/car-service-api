import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformStringToNumber } from '@app/common/transforms';
import { PAGINATION_DEFAULT_PROPERTIES } from '@app/common/helpers/pagination';

export class BaseIndexQueryDto {
  @Transform(transformStringToNumber)
  @IsOptional()
  @IsNumber()
  public readonly limit?: number = PAGINATION_DEFAULT_PROPERTIES.LIMIT;

  @Transform(transformStringToNumber)
  @IsOptional()
  @IsNumber()
  public readonly page?: number = PAGINATION_DEFAULT_PROPERTIES.LIMIT;
}
