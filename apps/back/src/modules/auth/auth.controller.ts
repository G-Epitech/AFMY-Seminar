import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthLogInDto } from './dtos/auth-login.dto';
import { BadRequest, OK } from '../../classes/responses';

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
      },
    });
  }
}
