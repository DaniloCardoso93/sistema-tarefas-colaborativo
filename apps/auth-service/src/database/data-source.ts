import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'challenge_db',
  entities: [User],
  migrations: [__dirname + '/migrations/*.ts'],
});
