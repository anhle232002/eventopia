import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

export const imageFileValidations = [
  new MaxFileSizeValidator({ maxSize: 1000 * 5000 }),
  new FileTypeValidator({ fileType: 'image/*' }),
];
