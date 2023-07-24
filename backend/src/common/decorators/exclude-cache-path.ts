import { SetMetadata } from '@nestjs/common';

export const ExcludeCache = (paths: string[]) => {
  return SetMetadata('exclude-cache', paths);
};
