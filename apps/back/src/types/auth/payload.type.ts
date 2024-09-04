import { TokenType } from '../../constants/auth/token-types.enum';

export type TokenPayload = {
  sub: number;
  tokenType: TokenType;
};
