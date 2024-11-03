import { loadDatabaseConfig } from './database.config';

export * from './database.config';

export const configLoaders = [loadDatabaseConfig];
