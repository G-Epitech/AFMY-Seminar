import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import TokenType from '../../constants/auth/token-types.enum';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from '../../constants/auth/token-expirations';
import { TokenPayload } from '../../types/auth/payload.type';
import { Request } from 'express';
import { AuthUserContext } from './auth.user.context';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly _jwtService: JwtService;

  @Inject(AuthUserContext)
  private readonly _authUserContext: AuthUserContext;

  public async loginPasswordAsync(
    email: string,
    password: string,
  ): Promise<boolean> {
    return true;
  }

  public async genAccessTokenAsync(user: any) {
    const payload: TokenPayload = {
      sub: user.id,
      tokenType: TokenType.ACCESS,
    };

    return this._jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
  }

  public async genRefreshTokenAsync(user: any) {
    const payload: TokenPayload = {
      sub: user.id,
      tokenType: TokenType.REFRESH,
    };

    return this._jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
  }

  public async refreshTokenAsync(refreshToken: string): Promise<string | null> {
    try {
      const decoded = this._jwtService.verify<TokenPayload>(refreshToken);
      const user = decoded.tokenType === TokenType.REFRESH ? 'fakeToken' : null;

      return user ? this.genAccessTokenAsync(user) : null;
    } catch (error) {
      return null;
    }
  }

  public async setUserContextFromTokenPayloadAsync(
    payload: TokenPayload,
  ): Promise<boolean> {
    return true;
  }

  public extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public isValidTokenPayload(payload: Partial<TokenPayload>): boolean {
    return 'sub' in payload && 'tokenType' in payload;
  }
}
