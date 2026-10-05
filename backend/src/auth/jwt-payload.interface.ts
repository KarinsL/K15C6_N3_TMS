import { Role } from '../common/enums/role.enum';

export type TokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;
  type: TokenType;
  roles?: Role[];
}

/** What guards attach to request.user after a valid access token. */
export interface AuthUser {
  id: string;
  roles: Role[];
}
