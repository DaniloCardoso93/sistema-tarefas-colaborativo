import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'challenge_db',
  entities: [__dirname + '/../../**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
});
