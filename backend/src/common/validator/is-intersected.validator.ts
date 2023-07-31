import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isDateBefore', async: false })
export class IsNotIntersected implements ValidatorConstraintInterface {
  validate(propertyValue: number[], args: ValidationArguments) {
    if (!args.object[args.constraints[0]]) {
      return true;
    }

    return !this.isIntersected(propertyValue, args.object[args.constraints[0]]);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `"${args.property}" must not contains common value with "${args.constraints[0]}"`;
  }

  isIntersected(arr1: number[], arr2: number[]) {
    const set1 = new Set(arr1);
    for (const item of arr2) {
      if (set1.has(item)) {
        return true;
      }
    }
    return false;
  }
}
