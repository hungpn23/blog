import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { EndpointOptions } from './endpoint.decorator';

export type PaginatedOptions = Required<
  Pick<EndpointOptions, 'type' | 'paginationType'>
>;

export function ApiPaginatedResponse(
  options: PaginatedOptions,
): MethodDecorator {
  const decorators: MethodDecorator[] = [];

  decorators.push(ApiExtraModels(() => options.type));

  decorators.push(
    ApiOkResponse({
      description: `Paginated list of ${options.type.name}`,
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
              // !! Resolver error at paths./api/post.get.responses.200.content.application/json.schema.properties.metadata.$ref
              // !! Could not resolve reference: Could not resolve pointer: /components/schemas/OffsetMetadataDto does not exist in document
              // metadata: {
              //   $ref: getSchemaPath(OffsetMetadataDto),
              // },
            },
          },
        ],
      },
    }),
  );

  return applyDecorators(...decorators);
}
