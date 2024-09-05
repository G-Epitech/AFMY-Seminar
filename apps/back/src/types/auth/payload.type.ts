import { TokenType } from '../../constants/auth/token-types.enum';

export type TokenPayload = {
  sub: number;
  legacyToken?: string;
  tokenType: TokenType;
};
