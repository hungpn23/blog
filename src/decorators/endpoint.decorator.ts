import { CommonErrorDto, ErrorDto } from '@/dto/error/error.dto';
import { multerStorage } from '@/utils/multer-storage';
import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { STATUS_CODES } from 'node:http';
import { Public } from './public.decorator';
import { ApiPaginatedResponse } from './swagger.decorator';

const DEFAULT_STATUS_CODE = HttpStatus.OK;

export type EndpointOptions = {
  type?: Type<any>;
  isPublic?: boolean;
  summary?: string;
  description?: string; // for success response
  statusCode?: HttpStatus;
  errorStatusCodes?: HttpStatus[];
  isPaginated?: boolean;
  params?: ApiParamOptions[];
};

export function ApiEndpoint(options: EndpointOptions = {}): MethodDecorator {
  const { description = 'OK', statusCode = DEFAULT_STATUS_CODE } = options;

  const decorators: MethodDecorator[] = [];

  // runtime
  decorators.push(SerializeOptions({ type: options?.type }));
  decorators.push(HttpCode(statusCode));

  // documentation

  // TODO: markdown description https://trilon.io/blog/nestjs-swagger-tips-tricks
  if (options?.summary)
    decorators.push(ApiOperation({ summary: options?.summary }));

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
      ? ApiPaginatedResponse(options?.type)
      : ApiOkResponse({
          type: options?.type,
          description,
        }),
  );

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

export function ApiFile(fileName: string): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fileName, { storage: multerStorage(`${fileName}s`) }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
        required: [fileName],
      },
    }),
  );
}

export function ApiArrayFiles(
  fileName: string,
  extraModels: Function,
  maxCount: number = 3,
): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fileName, maxCount, {
        storage: multerStorage(fileName),
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiExtraModels(extraModels),
    ApiBody({
      required: true,
      schema: {
        allOf: [
          {
            properties: {
              [fileName]: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
            required: [fileName],
          },
          {
            $ref: getSchemaPath(extraModels),
          },
        ],
      },
    }),
  );
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