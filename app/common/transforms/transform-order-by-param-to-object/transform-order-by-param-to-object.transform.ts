import { TransformFnParams } from 'class-transformer';
import type { TransformedOrderByParam } from './transform-order-by-param-to-object.type';

export const transformOrderByParamToObject = <EntityKeys extends string>({
  value,
}: TransformFnParams): TransformedOrderByParam<EntityKeys> => {
  if (!Array.isArray(value)) {
    return value;
  }

  const entries: string[][] = value.map((item) => {
    return item.split(',').map((splitItem) => splitItem.trim());
  });

  return Object.fromEntries(entries);
};
