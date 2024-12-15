import { ErrorDto } from '@/dto/error/error.dto';
import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Type,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  OmitType,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'node:http';
import { Public } from './public.decorator';
import { ApiPaginatedResponse } from './swagger.decorator';

const DEFAULT_STATUS_CODE = HttpStatus.OK;
const DEFAULT_ERROR_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;

export type EndpointOptions = {
  type?: Type<any>;
  isPublic?: boolean;
  summary?: string;
  description?: string; // for success response
  statusCode?: HttpStatus;
  errorStatusCodes?: HttpStatus[];
  isPaginated?: boolean;
  paginationType?: 'offset' | 'cursor';
  params?: ApiParamOptions[];
};

export function ApiEndpoint(options: EndpointOptions = {}): MethodDecorator {
  const {
    description = 'OK',
    paginationType = 'offset',
    statusCode = DEFAULT_STATUS_CODE,
  } = options;

  const decorators: MethodDecorator[] = [];

  // default
  decorators.push(SerializeOptions({ type: options?.type }));
  decorators.push(HttpCode(statusCode));
  decorators.push(
    ApiResponse({
      type: OmitType(ErrorDto, ['details']),
      status: DEFAULT_ERROR_STATUS_CODE,
      description: STATUS_CODES[DEFAULT_ERROR_STATUS_CODE],
    }),
  );

  const defaultErrorCodes = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNPROCESSABLE_ENTITY,
  ];

  if (options?.errorStatusCodes) {
    defaultErrorCodes.push(...options.errorStatusCodes);
  }

  defaultErrorCodes.forEach((statusCode) => {
    decorators.push(
      ApiResponse({
        type:
          statusCode === HttpStatus.UNPROCESSABLE_ENTITY
            ? ErrorDto
            : OmitType(ErrorDto, ['details']),
        status: statusCode,
        description: STATUS_CODES[statusCode],
      }),
    );
  });

  if (options?.isPublic) {
    decorators.push(Public());
  }

  if (options?.summary) {
    decorators.push(ApiOperation({ summary: options.summary }));
  }

  decorators.push(
    options?.isPaginated
      ? ApiPaginatedResponse({ type: options?.type, paginationType })
      : ApiOkResponse({
          type: options?.type,
          description,
        }),
  );

  if (options?.params) {
    options.params.forEach((param) => {
      decorators.push(ApiParam(param));
    });
  }

  return applyDecorators(...decorators);
}
