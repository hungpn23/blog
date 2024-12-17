import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
} from 'class-validator';
import { ToLowerCase, ToUpperCase } from './transforms.decorator';
import { Nullable } from './validators/nullable.decorator';

type CommonOptions = {
  isArray?: boolean; // to check if prop is an array & to validate each items in array
  nullable?: boolean;
  required?: boolean;
};

type NumberOptions = CommonOptions & {
  min?: number;
  max?: number;
  isInt?: boolean;
  isPositive?: boolean;
};

type StringOptions = CommonOptions & {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
};

export function NumberDecorators(options?: NumberOptions): PropertyDecorator {
  let decorators = [Type(() => Number)];

  decorators = checkCommonOptions(decorators, options);

  decorators.push(
    options?.isInt
      ? IsInt({ each: options.isArray })
      : IsNumber({}, { each: options.isArray }),
  );

  if (options?.min) {
    decorators.push(Min(options.min, { each: options.isArray }));
  }

  if (options?.max) {
    decorators.push(Max(options.max, { each: options.isArray }));
  }

  if (options?.isPositive) {
    decorators.push(IsPositive({ each: options.isArray }));
  }

  return applyDecorators(...decorators);
}

export function StringDecorators(options?: StringOptions): PropertyDecorator {
  let decorators = [Type(() => String), IsString({ each: options.isArray })];

  decorators = checkCommonOptions(decorators, options);
  decorators.push(
    MinLength(options?.minLength || 1, { each: options?.isArray }),
  );

  if (options?.maxLength)
    decorators.push(MaxLength(options?.maxLength, { each: options?.isArray }));

  if (options?.toLowerCase) decorators.push(ToLowerCase());

  if (options?.toUpperCase) decorators.push(ToUpperCase());

  return applyDecorators(...decorators);
}

// export function TokenDecorators(
//   options?: CommonOptions,
// ): PropertyDecorator {
//   let decorators = [Type(() => String), IsJWT({ each: options.isArray })];

//   decorators = checkCommonOptions(decorators, options);

//   return applyDecorators(...decorators);
// }

// export function PasswordDecorators(
//   options?: StringOptions,
// ): PropertyDecorator {
//   let decorators = [
//     StringDecorators({ ...options, minLength: 6 }),
//     IsPassword(),
//   ];

//   decorators = checkCommonOptions(decorators, options);

//   return applyDecorators(...decorators);
// }

// export function BooleanDecorators(
//   options?: StringOptions,
// ): PropertyDecorator {
//   let decorators = [ToBoolean(), IsBoolean()];

//   decorators = checkCommonOptions(decorators, options);

//   return applyDecorators(...decorators);
// }

// export function EmailDecorators(
//   options?: StringOptions,
// ): PropertyDecorator {
//   let decorators = [
//     IsEmail(),
//     StringDecorators({ toLowerCase: true, ...options }),
//   ];

//   decorators = checkCommonOptions(decorators, options);

//   return applyDecorators(...decorators);
// }

// export function UUIDDecorators(
//   options?: CommonOptions,
// ): PropertyDecorator {
//   let decorators = [Type(() => String), IsUUID('4', { each: options.isArray })];
//   const type = options.isArray ? [String] : String;
//   decorators = checkCommonOptions(decorators, options);

//   return applyDecorators(...decorators);
// }

export function EnumDecorators(
  entity: object,
  options?: CommonOptions,
): PropertyDecorator {
  let decorators = [IsEnum(entity, { each: options?.isArray })];
  decorators = checkCommonOptions(decorators, options);

  return applyDecorators(...decorators);
}

// export function ClassDecorators(
//   options?: StringOptions,
// ): PropertyDecorator {
//   let decorators = [Type(() => String), IsUUID('4', { each: options.isArray })];
//   const type = options.isArray ? [String] : String;
//   decorators = checkCommonOptions(decorators, options);

//   return applyDecorators(...decorators);
// }

/* =================================================================== */

function checkCommonOptions(
  decorators: PropertyDecorator[],
  options?: CommonOptions,
) {
  if (options?.required === false)
    decorators.push(IsOptional({ each: options.isArray }));

  decorators.push(
    options.nullable
      ? Nullable({ each: options.isArray })
      : NotEquals(null, { each: options.isArray }),
  );

  return decorators;
}
