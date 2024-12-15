// !! this module is deprecated

import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsJWT,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
} from 'class-validator';
import { ToBoolean, ToLowerCase, ToUpperCase } from './transforms.decorator';
import { IsPassword } from './validators/is-password.decorator';
import { Nullable } from './validators/nullable.decorator';

type CommonOptions = {
  isArray?: boolean; // to check if prop is an array & to validate each items in array
  swagger?: boolean;
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

type EnumOptions = CommonOptions & {
  enumName?: string;
};

export function NumberDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & NumberOptions = {},
): PropertyDecorator {
  let decorators = [Type(() => Number)];

  decorators = checkOptions(Number, decorators, options);

  if (options.isInt) {
    decorators.push(IsInt({ each: options.isArray }));
  } else {
    decorators.push(IsNumber({}, { each: options.isArray }));
  }

  if (typeof options.min === 'number') {
    decorators.push(Min(options.min, { each: options.isArray }));
  }

  if (typeof options.max === 'number') {
    decorators.push(Max(options.max, { each: options.isArray }));
  }

  if (options.isPositive) {
    decorators.push(IsPositive({ each: options.isArray }));
  }

  return applyDecorators(...decorators);
}

export function StringDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & StringOptions = {},
): PropertyDecorator {
  let decorators = [Type(() => String), IsString({ each: options.isArray })];

  decorators = checkOptions(String, decorators, options);
  decorators.push(MinLength(options.minLength || 1, { each: options.isArray }));

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.isArray }));
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}

export function TokenDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & CommonOptions = {},
): PropertyDecorator {
  let decorators = [Type(() => String), IsJWT({ each: options.isArray })];

  decorators = checkOptions(String, decorators, options);

  return applyDecorators(...decorators);
}

export function PasswordDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & StringOptions = {},
): PropertyDecorator {
  let decorators = [
    StringDecorators({ ...options, minLength: 6 }),
    IsPassword(),
  ];

  decorators = checkOptions(String, decorators, options);

  return applyDecorators(...decorators);
}

export function BooleanDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & StringOptions = {},
): PropertyDecorator {
  let decorators = [ToBoolean(), IsBoolean()];

  decorators = checkOptions(Boolean, decorators, options);

  return applyDecorators(...decorators);
}

export function EmailDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & StringOptions = {},
): PropertyDecorator {
  let decorators = [
    IsEmail(),
    StringDecorators({ toLowerCase: true, ...options }),
  ];

  decorators = checkOptions(String, decorators, options);

  return applyDecorators(...decorators);
}

export function UUIDDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & CommonOptions = {},
): PropertyDecorator {
  let decorators = [Type(() => String), IsUUID('4', { each: options.isArray })];
  const type = options.isArray ? [String] : String;
  decorators = checkOptions(type, decorators, options);

  return applyDecorators(...decorators);
}

export function EnumDecorators(
  entity: object,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & CommonOptions = {},
): PropertyDecorator {
  let decorators = [IsEnum(entity, { each: options.isArray })];
  const type = options.isArray ? [String] : String;
  decorators = checkOptions(type, decorators, options);

  return applyDecorators(...decorators);
}

export function ClassDecorators(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & StringOptions = {},
): PropertyDecorator {
  let decorators = [Type(() => String), IsUUID('4', { each: options.isArray })];
  const type = options.isArray ? [String] : String;
  decorators = checkOptions(type, decorators, options);

  return applyDecorators(...decorators);
}

/* =================================================================== */

function checkOptions(
  type: any,
  decorators: PropertyDecorator[],
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & CommonOptions = {},
) {
  const { required = true, ...restOptions } = options;
  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type,
        required,
        isArray: restOptions.isArray,
        ...restOptions,
      }),
    );
  }

  if (options.nullable) {
    decorators.push(Nullable({ each: options.isArray }));
  } else {
    decorators.push(NotEquals(null, { each: options.isArray }));
  }

  if (!required) {
    decorators.push(IsOptional({ each: options.isArray }));
  }

  return decorators;
}
