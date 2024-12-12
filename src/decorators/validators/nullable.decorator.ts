import { ValidateIf, type ValidationOptions } from 'class-validator';

export const Nullable = (options?: ValidationOptions): PropertyDecorator => {
  return ValidateIf((_obj, value) => value !== null, options);
};
