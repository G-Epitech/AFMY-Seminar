import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  UserEntity,
  UserMsEntraIdentifierEntity,
} from 'src/providers/database/entities';
import { AuthUserContext } from './auth.user.context';
import { AuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([UserEntity, UserMsEntraIdentifierEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [AuthService, AuthUserContext, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthUserContext, AuthGuard],
})
export class AuthModule {}
