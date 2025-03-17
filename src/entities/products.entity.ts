import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './categories.entity';
import { OrderDetail } from './orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    description: 'El identificador único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del producto (único)',
    example: 'Laptop Asus ZenBook',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Laptop con procesador Intel Core i7, 16GB RAM, 512GB SSD, pantalla 14 pulgadas',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99,
    type: 'number',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 25,
    type: 'integer',
  })
  @Column({ type: 'int', nullable: false })
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://assets.soyhenry.com/LOGO-REDES-01_og.jpg',
    required: false,
    nullable: true,
  })
  @Column({
    nullable: true,
    type: 'text',
    default: 'https://assets.soyhenry.com/LOGO-REDES-01_og.jpg',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'Detalles de los pedidos que incluyen este producto',
    type: () => [OrderDetail],
  })
  @ManyToMany(() => OrderDetail, (orderderDetail) => orderderDetail.products)
  orderDetails: OrderDetail[];

  @ApiProperty({
    description: 'Categoría a la que pertenece el producto',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}