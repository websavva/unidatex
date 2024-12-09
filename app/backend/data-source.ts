import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { postgresConfigLoader } from './src/shared/modules/config/loaders';
import { allEntities } from './src/shared/entities';

config();

const { host, password, port, user, db } = postgresConfigLoader();

export default new DataSource({
  type: 'postgres',
  host,
  username: user,
  password,
  port,
  database: db,
  entities: allEntities,
  logging: true,
  synchronize: false,
  migrations: ['./migrations/*.ts'],
});
