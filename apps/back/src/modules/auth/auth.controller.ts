import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { BadRequest } from '../../classes/responses';
import { InPostAuthForgotPasswordDto, InPostAuthLogInDto, InPostAuthResetPasswordDto, OutPostAuthLogInDto } from '@seminar/common';

@Controller('/auth')
export class AuthController {
  @Inject(AuthService)
  private _authService: AuthService;

  @Public()
  @Post('login')
  async authEmployee(
    @Body() dto: InPostAuthLogInDto,
  ): Promise<OutPostAuthLogInDto> {
    const result = await this._authService.login(dto.email, dto.password);

    if (!result) {
      throw new BadRequest({ message: 'Invalid email or password' });
    }
    return {
      tokens: {
        access: await this._authService.generateAccessToken(result),
      },
    };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: InPostAuthForgotPasswordDto) {
    await this._authService.forgotPassword(dto.email);
    return { message: 'If the email exists, a reset link will be sent' };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() dto: InPostAuthResetPasswordDto,
  ) {
    const success = await this._authService.resetPassword(dto.token, dto.password);
    if (!success) {
      throw new BadRequest({ message: 'Invalid token' });
    }
    return { message: 'Successfully reset password' };
  }
}
