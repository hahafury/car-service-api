import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBiggerThan(
  value: number,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isBiggerThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(propertyValue: number) {
          return (
            typeof value === 'number' &&
            typeof propertyValue === 'number' &&
            propertyValue > value
          );
        },
      },
    });
  };
}
