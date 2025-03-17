import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import * as crypto from 'crypto';

// Intentar cargar variables de entorno
try {
  dotenvConfig({ path: '.env.development.local' });
} catch (e) {
  dotenvConfig();
}

// Solo asignar crypto al objeto global si no existe
if (!(global as any).crypto) {
  // Comprobar si crypto ya existe en global
  try {
    (global as any).crypto = crypto;
  } catch (e) {
    console.warn(
      'No se puede asignar crypto al objeto global, pero esto es normal en Node.js 20+',
    );
  }
}

const config = {
  type: 'postgres',
  // Prioriza la URL de conexión completa si está disponible
  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
      }
    : {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
  // Solo aplicar SSL si no es una conexión local
  ...(process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('localhost')
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

// Exportación para NestJS (AppModule)
export default registerAs('typeorm', () => config);

// Exportación para migraciones (Express)
export const connectionSource = new DataSource(config as DataSourceOptions);
