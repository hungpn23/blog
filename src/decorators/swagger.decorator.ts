import { OffsetPaginatedDto } from '@/dto/offset-pagination/paginated.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { EndpointOptions } from './endpoint.decorator';

export type PaginatedOptions = Required<
  Pick<EndpointOptions, 'type' | 'paginationType'>
>;

export function ApiPaginatedResponse(
  options: PaginatedOptions,
): MethodDecorator {
  // see: https://aalonso.dev/blog/2021/how-to-generate-generics-dtos-with-nestjsswagger-422g
  return applyDecorators(
    ApiExtraModels(OffsetPaginatedDto, options.type),
    ApiOkResponse({
      description: `Array of ${options.type.name} and metadata`,
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          {
            $ref: getSchemaPath(OffsetPaginatedDto),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    }),
  );
}
