import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/jwt-auth.guard';
import { EmployeesModule } from '../employees/employees.module';
import { AuthEmployeeContext } from './auth.employee.context';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    EmployeesModule,
  ],
  providers: [AuthService, AuthGuard, AuthEmployeeContext],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, AuthEmployeeContext],
})
export class AuthModule {}
