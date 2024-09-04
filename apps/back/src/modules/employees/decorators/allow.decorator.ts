import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permission } from '@seminar/common';

export const ALLOW_DECORATOR_KEY = 'allow-decorator';
export const Allow = (...permissions: Permission[]) => {
  return applyDecorators(
    SetMetadata(ALLOW_DECORATOR_KEY, permissions),
    UseGuards(PermissionsGuard),
  );
};
