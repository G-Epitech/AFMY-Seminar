import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLogInDto } from './dtos/auth-login.dto';
import { Request } from 'express';
import { BadRequest, OK } from '../../classes/responses';
import { Permission } from '@seminar/common';
import { Allow } from '../employees/decorators/allow.decorator';

@Controller('/auth')
export class AuthController {
  @Inject(AuthService)
  private _authService: AuthService;

  @Public()
  @Post('login')
  async authEmployee(@Body() dto: AuthLogInDto) {
    const result = await this._authService.login(dto.email, dto.password);

    if (!result) {
      throw new BadRequest({ message: 'Invalid email or password' });
    }
    return new OK({
      tokens: {
        access: await this._authService.generateAccessToken(result),
        refresh: await this._authService.generateRefreshToken(result),
      },
    });
  }

  @Public()
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const refresh = this._authService.extractTokenFromRequest(req);
    if (!refresh) {
      throw new BadRequest({ message: 'Invalid refresh token' });
    }
    const token = await this._authService.refreshTokenAsync(refresh);
    if (!token) {
      throw new BadRequest({ message: 'Invalid or expired refresh token' });
    }
    return new OK(token);
  }
}
