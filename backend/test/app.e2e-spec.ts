import { Controller, Get, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from '../src/app.setup';
import { AuthModule } from '../src/auth/auth.module';
import { TokenService } from '../src/auth/token.service';
import { Roles } from '../src/common/decorators/roles.decorator';
import { Role } from '../src/common/enums/role.enum';
import configuration from '../src/config/configuration';
import { HealthModule } from '../src/health/health.module';

@Controller('admin-only')
class AdminOnlyController {
  @Roles(Role.ADMIN)
  @Get()
  get() {
    return { ok: true };
  }
}

// Boots the HTTP layer and auth guards without a database.
describe('HTTP + auth (e2e)', () => {
  let app: INestApplication<App>;
  let tokens: TokenService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        AuthModule,
        HealthModule,
      ],
      controllers: [AdminOnlyController],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app, []);
    await app.init();
    tokens = moduleRef.get(TokenService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health is public', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) =>
        expect((res.body as { status: string }).status).toBe('UP'),
      );
  });

  it('rejects a protected route without a token', () => {
    return request(app.getHttpServer()).get('/api/v1/admin-only').expect(401);
  });

  it('allows a protected route with an ADMIN access token', async () => {
    const { accessToken } = await tokens.issueTokens('1', [Role.ADMIN]);
    return request(app.getHttpServer())
      .get('/api/v1/admin-only')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('forbids a user without the required role', async () => {
    const { accessToken } = await tokens.issueTokens('2', [Role.STUDENT]);
    return request(app.getHttpServer())
      .get('/api/v1/admin-only')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('rejects a refresh token used as an access token', async () => {
    const { refreshToken } = await tokens.issueTokens('1', [Role.ADMIN]);
    return request(app.getHttpServer())
      .get('/api/v1/admin-only')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(401);
  });
});
