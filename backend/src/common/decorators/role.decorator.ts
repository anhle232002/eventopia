import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/constants/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
