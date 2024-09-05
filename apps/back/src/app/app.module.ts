import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { EmployeesModule } from '../modules/employees/employees.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { CustomersModule } from '../modules/customers/customers.module';
import { LegacyApiModule } from '../providers/legacy-api/legacy-api.module';
import { AuthGuard } from '../modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [LegacyApiModule, AuthModule, EmployeesModule, CustomersModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
