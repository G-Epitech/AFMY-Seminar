import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import TokenType from '../../constants/auth/token-types.enum';
import { TokenPayload } from '../../types/auth/payload.type';
import { AuthEmployeeContext } from './auth.employee.context';
import { EmployeesService } from '../employees/employees.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ACCESS_TOKEN_EXPIRATION } from '../../constants/auth/token-expirations';
import { LegacyApiService } from '../../providers/legacy-api/legacy-api.service';
import { EmployeesMigrationService } from '../employees/employees-migration.service';
import {
  EmployeeWithCredentials,
  EmployeeWithLegacyData,
} from '../../types/employees';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly _jwtService: JwtService;

  @Inject(AuthEmployeeContext)
  private readonly _authEmployeeContext: AuthEmployeeContext;

  @Inject(EmployeesService)
  private readonly _employeesService: EmployeesService;

  @Inject(EmployeesMigrationService)
  private readonly _employeesMigrationService: EmployeesMigrationService;

  @Inject(LegacyApiService)
  private readonly _legacyApiService: LegacyApiService;

  private readonly algorithm = 'aes-256-cbc';
  private readonly key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  private readonly iv = Buffer.from(process.env.ENCRYPTION_IV!, 'hex');

  private encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

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

  private async onFirstLogin(
    legacyToken: string,
    email: string,
    password: string,
  ): Promise<EmployeeWithCredentials | null> {
    return await this._employeesMigrationService.importEmployeeWithCredentials(
      legacyToken,
      email,
      password,
    );
  }

  public async login(
    email: string,
    password: string,
  ): Promise<EmployeeWithLegacyData | null> {
    const legacyToken = await this.legacyLogin(email, password);
    let found =
      await this._employeesService.getEmployeeByEmailWithCredentials(email);

    console.log('From local db', found);
    console.log('Legacy token', legacyToken);
    if ((!found || !found.credentials) && legacyToken)
      found = await this.onFirstLogin(legacyToken, email, password);

    console.log('From local db after first login', found);

    if (!found || !found.credentials) return null;

    const { credentials, ...employeeData } = found;
    const employee: EmployeeWithLegacyData = {
      ...employeeData,
      legacyToken: legacyToken,
    };

    if (await bcrypt.compare(password, credentials.password)) {
      this._authEmployeeContext.employee = employee;
      return employee;
    }
    return null;
  }

  public async generateAccessToken(employee: EmployeeWithLegacyData) {
    const payload: TokenPayload = {
      sub: employee.id,
      tokenType: TokenType.ACCESS,
    };

    if (employee.legacyToken)
      payload.legacyToken = this.encrypt(employee.legacyToken);

    return this._jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
  }

  public async setEmployeeContextFromTokenPayloadAsync(
    payload: TokenPayload,
  ): Promise<boolean> {
    const employee = await this._employeesService.getEmployeeById(payload.sub);

    if (!employee) {
      return false;
    }

    console.log('employee', employee);
    this._authEmployeeContext.employee = {
      ...employee,
      legacyToken: payload.legacyToken
        ? this.decrypt(payload.legacyToken)
        : null,
    };
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
