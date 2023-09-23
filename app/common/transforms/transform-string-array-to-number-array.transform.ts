import { TransformFnParams } from 'class-transformer';

export const transformStringArrayToNumberArray = ({
  value,
}: TransformFnParams): (number | null)[] => {
  if (typeof value !== 'string') {
    return value;
  }
  return value
    .replace(/\[|\]/g, '')
    .split(',')
    .map((item: any) => {
      const transformedValue: number = Number(item);
      return !isNaN(transformedValue) ? transformedValue : null;
    });
};
