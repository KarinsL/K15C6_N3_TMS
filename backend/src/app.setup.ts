import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

/**
 * Global HTTP setup shared by main.ts and the e2e tests. Routes are served under /api/v1/...
 */
export function configureApp(app: INestApplication, corsOrigins: string[]) {
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: corsOrigins, credentials: true });
}
