import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// export const IS_PRIVATE_KEY = 'isPrivate';
// export const Private = () => SetMetadata(IS_PRIVATE_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
