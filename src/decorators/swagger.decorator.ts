import { OffsetMetadataDto } from '@/dto/offset-pagination/metadata.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { EndpointOptions } from './endpoint.decorator';

export type PaginatedOptions = Required<
  Pick<EndpointOptions, 'type' | 'paginationType'>
>;

export function ApiPaginatedResponse(
  options: PaginatedOptions,
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(OffsetMetadataDto),
    ApiOkResponse({
      description: `Array of ${options.type.name} and metadata`,
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(options.type) },
          },
          metadata: {
            $ref: getSchemaPath(OffsetMetadataDto),
          },
        },
      },
    }),
  );
}
