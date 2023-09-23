import { TransformFnParams } from 'class-transformer';

export const transformStringToNumber = ({
  value,
}: TransformFnParams): number | null => {
  if (typeof value !== 'string') {
    return value;
  }
  const transformedValue: number = Number(value);
  return !isNaN(transformedValue) ? transformedValue : null;
};
