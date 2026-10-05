import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Role } from '../common/enums/role.enum';
import configuration from '../config/configuration';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        JwtModule.register({
          secret: 'test-secret-at-least-32-characters-long',
        }),
      ],
      providers: [TokenService],
    }).compile();

    tokenService = moduleRef.get(TokenService);
  });

  it('issues an access token carrying the roles', async () => {
    const { accessToken } = await tokenService.issueTokens('42', [Role.ADMIN]);
    const payload = await tokenService.verify(accessToken);
    expect(payload).toMatchObject({
      sub: '42',
      type: 'access',
      roles: ['ADMIN'],
    });
  });

  it('issues a refresh token without roles', async () => {
    const { refreshToken } = await tokenService.issueTokens('42', [Role.ADMIN]);
    const payload = await tokenService.verify(refreshToken);
    expect(payload.type).toBe('refresh');
    expect(payload.roles).toBeUndefined();
  });

  it('rejects a tampered token', async () => {
    const { accessToken } = await tokenService.issueTokens('42', []);
    await expect(tokenService.verify(accessToken + 'x')).rejects.toThrow();
  });
});
