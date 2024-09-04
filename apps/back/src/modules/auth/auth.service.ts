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

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly _jwtService: JwtService;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Inject(EmployeesService)
  private readonly _employeesService: EmployeesService;

  private async legacyLogin(email: string, password: string) {
    const response = await fetch(
      'https://soul-connection.fr/api/employees/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Group-Authorization': 'e0aedfc113bc21eb073e7b08c39b8ddc',
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const b: { access_token: string } = await response.json();
    console.log('b', b.access_token);
    return response.ok;
  }

  private async onFirstLogin(email: string, password: string) {
    console.log('Legacy login');
    console.log('User data migration');
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
