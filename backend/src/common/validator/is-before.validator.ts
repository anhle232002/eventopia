import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isDateBefore', async: false })
export class IsDateBefore implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue > args.object[args.constraints[0]];
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `"${args.property}" must be after "${args.constraints[0]}"`;
  }
}
