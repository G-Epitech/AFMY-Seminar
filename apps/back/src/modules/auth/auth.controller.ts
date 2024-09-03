import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLogInDto } from './dtos/auth-login.dto';
import { Request } from 'express';
import { ResponseErrors } from '@seminar/common';
import { BadRequest, OK } from '../../classes/responses';
import { FieldsError } from '../../classes/errors/fields.error';

@Controller('/auth')
export class AuthController {
  @Inject(AuthService)
  private _authService: AuthService;

  @Public()
  @Post('login')
  async authUser(@Body() dto: AuthLogInDto) {
    const result = await this._authService.loginPasswordAsync(
      dto.email,
      dto.password,
    );

    if (!result) {
      throw new BadRequest({ message: 'Invalid email or password' });
    } else if (result instanceof FieldsError) {
      throw new BadRequest({
        errors: FieldsError.aggregate<ResponseErrors>(result),
      });
    }
    return new OK({
      tokens: {
        access: await this._authService.genAccessTokenAsync(result),
        refresh: await this._authService.genRefreshTokenAsync(result),
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
