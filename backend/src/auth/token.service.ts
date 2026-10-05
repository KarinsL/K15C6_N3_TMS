import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';
import { JwtPayload } from './jwt-payload.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** Issues and verifies access/refresh tokens (HS256). */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async issueTokens(userId: string, roles: Role[]): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, type: 'access', roles } satisfies JwtPayload,
        { expiresIn: this.ttl('jwt.accessTtl') },
      ),
      this.jwtService.signAsync(
        { sub: userId, type: 'refresh' } satisfies JwtPayload,
        { expiresIn: this.ttl('jwt.refreshTtl') },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  private ttl(key: string): JwtSignOptions['expiresIn'] {
    return this.config.getOrThrow<string>(key) as JwtSignOptions['expiresIn'];
  }

  /** Throws if the token is invalid or expired. */
  verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
