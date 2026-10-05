import { DataSourceOptions } from 'typeorm';
import configuration from '../config/configuration';

/**
 * Shared by the Nest app and the TypeORM CLI (data-source.ts) so both use the same settings.
 */
export function buildTypeOrmOptions(): DataSourceOptions {
  const { database } = configuration();
  // .ts under ts-node (TypeORM CLI), .js once compiled; avoids matching .d.ts files in dist.
  const ext = __filename.endsWith('.ts') ? 'ts' : 'js';
  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.name,
    entities: [`${__dirname}/../**/*.entity.${ext}`],
    migrations: [`${__dirname}/migrations/*.${ext}`],
    synchronize: false,
  };
}
