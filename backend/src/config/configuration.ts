export interface AppConfig {
  port: number;
  corsOrigins: string[];
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    accessTtl: string;
    refreshTtl: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  corsOrigins: (process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'tms',
    password: process.env.DB_PASSWORD ?? 'tms',
    name: process.env.DB_NAME ?? 'tms',
  },
  jwt: {
    // At least 32 characters. Override with JWT_SECRET outside local development.
    secret:
      process.env.JWT_SECRET ?? 'change-me-local-dev-secret-at-least-32-chars',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  },
});
