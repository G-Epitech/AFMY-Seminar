import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthEmployeeContext } from '../../auth/auth.employee.context';
import { ALLOW_DECORATOR_KEY } from '../decorators/allow.decorator';
import { Permission } from '@seminar/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  @Inject(Reflector)
  private readonly _reflector: Reflector;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  canActivate(ctx: ExecutionContext): boolean {
    const employee = this._authEmployeeContext.employee;

    const permissions =
      this._reflector.getAllAndOverride<Permission[]>(ALLOW_DECORATOR_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) || [];

    return permissions.includes(employee.permission);
  }
}
