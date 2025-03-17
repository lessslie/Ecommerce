import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './orders.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'users',
})
export class User {
  @ApiProperty({
    description: 'El identificador único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario (único)',
    example: 'juan.perez@example.com',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (hash)',
    example: '$2b$10$uLO6.D8Z/mCbfqgqUE8UouQVMy1SPQTyMQGx/RvIkbpDxpsPFZmxe',
    maxLength: 60,
    writeOnly: true,
  })
  @Column({ type: 'varchar', length: 60, nullable: false })
  password: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 123456789,
    required: false,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  phone: number;

  @ApiProperty({
    description: 'País de residencia del usuario',
    example: 'Argentina',
    required: false,
    nullable: true,
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @ApiProperty({
    description: 'Dirección completa del usuario',
    example: 'Calle Falsa 123, Piso 4B',
  })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({
    description: 'Ciudad de residencia del usuario',
    example: 'Buenos Aires',
    required: false,
    nullable: true,
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @ApiProperty({
    description: 'Indica si el usuario tiene permisos de administrador',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Lista de pedidos realizados por el usuario',
    type: () => [Order],
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}