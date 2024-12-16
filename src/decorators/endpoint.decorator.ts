import { CommonErrorDto, ErrorDto } from '@/dto/error/error.dto';
import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Type,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
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

  if (options?.summary) {
    decorators.push(ApiOperation({ summary: options.summary }));
  }

  if (options?.params) {
    options.params.forEach((param) => {
      decorators.push(
        ApiParam({
          required: param.required ?? true,
          ...param,
        }),
      );
    });
  }

  decorators.push(options?.isPublic ? Public() : ApiBearerAuth());

  decorators.push(
    options?.isPaginated
      ? ApiPaginatedResponse({ type: options?.type, paginationType })
      : ApiOkResponse({
          type: options?.type,
          description,
        }),
  );

  decorators.push(SerializeOptions({ type: options?.type }));
  decorators.push(HttpCode(statusCode));

  handleErrorResponse(options?.errorStatusCodes, options?.isPublic).forEach(
    (statusCode) => {
      decorators.push(
        ApiResponse({
          type:
            statusCode === HttpStatus.UNPROCESSABLE_ENTITY
              ? ErrorDto
              : CommonErrorDto,
          status: statusCode,
          description: STATUS_CODES[statusCode],
        }),
      );
    },
  );

  return applyDecorators(...decorators);
}

function handleErrorResponse(
  errorStatusCodes: HttpStatus[] = [],
  isPublic: boolean = false,
) {
  const errorCodes = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];

  errorCodes.push(...errorStatusCodes);

  if (isPublic)
    return errorCodes.filter((code) => code !== HttpStatus.UNAUTHORIZED);

  return errorCodes;
}
