import { RoleEnum } from '@app/modules/user/types/role.enum';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: RoleEnum[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
