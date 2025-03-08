import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import * as crypto from 'crypto';

// Intenta cargar el archivo .env.development.local, pero no falla si no existe
try {
  dotenvConfig({ path: '.env.development.local' });
} catch (e) {
  // Intenta cargar .env por defecto
  dotenvConfig();
}

// Necesario para TypeORM con NestJS
(global as any).crypto = crypto;

// Configuración unificada que funciona tanto con URL como con parámetros individuales
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
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones a Supabase y otros proveedores cloud
  },
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production', // Solo sincroniza en desarrollo
  logging: process.env.NODE_ENV !== 'production', // Solo loguea en desarrollo
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

// Exportación para NestJS (AppModule)
export default registerAs('typeorm', () => config);

// Exportación para migraciones (Express)
export const connectionSource = new DataSource(config as DataSourceOptions);
