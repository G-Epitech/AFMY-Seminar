import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import TokenType from '../../constants/auth/token-types.enum';
import { TokenPayload } from '../../types/auth/payload.type';
import { AuthEmployeeContext } from './auth.employee.context';
import { EmployeesService } from '../employees/employees.service';
import { Employee } from '@seminar/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import {
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} from '../../constants/auth/token-expirations';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly _jwtService: JwtService;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Inject(EmployeesService)
  private readonly _employeesService: EmployeesService;

  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  private async legacyLogin(email: string, password: string) {
    try {
      const response = await this._legacyApiService.request(
        'POST /employees/login',
        {
          body: { password, email },
        },
      );

      return response.data.access_token;
    } catch (error) {
      return null;
    }
  }

  private async onFirstLogin(email: string, password: string) {
    const accessToken = await this.legacyLogin(email, password);

    if (!accessToken) return null;

    console.log('User data migration', accessToken);
    return null;
  }

  public async login(
    email: string,
    password: string,
  ): Promise<Employee | null> {
    const found =
      await this._employeesService.getEmployeeByEmailWithCredentials(email);

    if (!found || !found.credentials)
      return await this.onFirstLogin(email, password);

    const { credentials, ...employee } = found;
    if (await bcrypt.compare(password, credentials.password)) {
      return employee;
    }
    return null;
  }

  public async generateAccessToken(employee: Employee) {
    const payload: TokenPayload = {
      sub: employee.id,
      tokenType: TokenType.ACCESS,
    };

    return this._jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
  }

  public async generateRefreshToken(employee: Employee) {
    const payload: TokenPayload = {
      sub: employee.id,
      tokenType: TokenType.REFRESH,
    };

    return this._jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
  }

  public async refreshTokenAsync(refreshToken: string): Promise<string | null> {
    try {
      const decoded = this._jwtService.verify<TokenPayload>(refreshToken);
      const employee =
        decoded.tokenType === TokenType.REFRESH
          ? await this._employeesService.getEmployeeById(decoded.sub)
          : null;

      return employee ? this.generateAccessToken(employee) : null;
    } catch (error) {
      return null;
    }
  }

  public async setEmployeeContextFromTokenPayloadAsync(
    payload: TokenPayload,
  ): Promise<boolean> {
    const employee = await this._employeesService.getEmployeeById(payload.sub);

    if (!employee) {
      return false;
    }

    this._authEmployeeContext.employee = employee;
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
