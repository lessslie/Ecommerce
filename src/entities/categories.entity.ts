import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Product } from './products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'categories' })
export class Category {
  @ApiProperty({
    description: 'El identificador único de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría (único)',
    example: 'Electrónicos',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @ApiProperty({
    description: 'Productos pertenecientes a esta categoría',
    type: () => [Product],
  })
  @OneToMany(() => Product, product => product.category)
  @JoinColumn()
  products: Product[];
}