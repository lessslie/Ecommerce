import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env.development.local' });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
  // dropSchema:true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

//la exportacion que vamos a usar para NEST (app Moduele)
export default registerAs('typeorm', () => config);

// la exportacion que vamos a usar para las migraciones (EXPRESS)
export const connectionSource = new DataSource(config as DataSourceOptions);
