import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm.options';

// Used by the TypeORM CLI: npm run migration:run / migration:generate
export default new DataSource(buildTypeOrmOptions());
