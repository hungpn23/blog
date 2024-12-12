import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  NotEquals,
} from 'class-validator';
import { Nullable } from './validators/nullable.decorator';

type CommonOptions = {
  each?: boolean; // validate each items in array
  swagger?: boolean;
  nullable?: boolean;
  // required?: boolean;
};

type NumberOptions = CommonOptions & {
  min?: number;
  max?: number;
  int?: boolean;
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

export const NumberDecorators = (
  options: Omit<ApiPropertyOptions, 'type'> & NumberOptions,
): PropertyDecorator => {
  const decorators = [Type(() => Number)];

  if (options.swagger) {
    const { required = true, ...restOptions } = options;
    decorators.push(
      ApiProperty({ type: Number, required: !!required, ...restOptions }), // ep kieu boolean
    );
  }

  if (options.nullable) {
    decorators.push(Nullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.int) {
    decorators.push(IsInt({ each: options.each }));
  } else {
    decorators.push(IsNumber({}, { each: options.each }));
  }

  if (typeof options.min === 'number') {
    decorators.push(Min(options.min, { each: options.each }));
  }

  if (typeof options.max === 'number') {
    decorators.push(Max(options.max, { each: options.each }));
  }

  if (options.isPositive) {
    decorators.push(IsPositive({ each: options.each }));
  }

  return applyDecorators(...decorators);
};

export const OptionalNumberDecorators = (
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & NumberOptions,
): PropertyDecorator => {
  return applyDecorators(
    IsOptional({ each: options.each }),
    NumberDecorators({ required: false, ...options }),
  );
};
