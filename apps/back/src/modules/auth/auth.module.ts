import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/jwt-auth.guard';
import { EmployeesModule } from '../employees/employees.module';
import { AuthEmployeeContext } from './auth.employee.context';
import { LegacyApiModule } from '../../providers/legacy-api/legacy-api.module';
import { MailService } from './mail.service';
import { PrismaModule } from 'src/providers';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    forwardRef(() => EmployeesModule),
    LegacyApiModule,
  ],
  providers: [AuthService, AuthGuard, AuthEmployeeContext, MailService],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, AuthEmployeeContext],
})
export class AuthModule {}
