import { ParseFilePipeBuilder } from '@nestjs/common';

export function validateImagePipe(
  fileType: string | RegExp = /(jpeg|jpg|png)/,
  maxSize: number = 3 * 1000 * 1000, // 3 mb
) {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({ fileType })
    .addMaxSizeValidator({ maxSize })
    .build();
}
