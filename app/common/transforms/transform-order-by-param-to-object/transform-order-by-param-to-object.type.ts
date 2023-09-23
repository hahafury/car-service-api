import { OrderByCondition } from '@app/common/types';

export type TransformedOrderByParam<
  EntityKeys extends string | number | symbol,
> = Record<EntityKeys, OrderByCondition>;
