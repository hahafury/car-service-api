import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseOrderByValue } from '@app/common/enums';

@ValidatorConstraint({ name: 'IsOrderBy' })
@Injectable()
export class IsOrderByConstraint implements ValidatorConstraintInterface {
  async validate(
    value: Record<string, string>,
    args: ValidationArguments,
  ): Promise<any> {
    const [allowedProperties = []] = args.constraints;
    Object.entries(value).forEach(([property, orderByValue]): void => {
      const isPropertyAllowed: boolean = allowedProperties.some(
        (allowedProperty) => {
          return allowedProperty === property;
        },
      );
      if (!isPropertyAllowed) {
        throw new BadRequestException(`Property ${property} is not allowed!`);
      }
      if (
        orderByValue !== DatabaseOrderByValue.ASC &&
        orderByValue !== DatabaseOrderByValue.DESC
      ) {
        throw new BadRequestException(
          `Order value ${orderByValue} is not allowed!`,
        );
      }
    });
    return true;
  }
}
export function IsOrderBy(
  allowedProperties: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedProperties],
      validator: IsOrderByConstraint,
    });
  };
}
