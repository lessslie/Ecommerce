import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { Product } from './products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'order_details' })
export class OrderDetail {
  @ApiProperty({
    description: 'El identificador único del detalle de pedido',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Precio total del pedido',
    example: 1299.99,
    type: 'number',
  })
  @Column({
    name: 'total_price', 
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;
 
  // Campos para preservar información de productos cuando se actualicen
  
  @ApiProperty({
    description: 'Nombre del producto al momento de realizar el pedido',
    example: 'Laptop Asus ZenBook',
  })
  @Column()
  productName: string;

  @ApiProperty({
    description: 'Precio del producto al momento de realizar el pedido',
    example: 1299.99,
    type: 'number',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  productPrice: number;

  @ApiProperty({
    description: 'Pedido al que pertenece este detalle',
    type: () => Order,
  })
  @OneToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({
    description: 'Productos incluidos en este detalle de pedido',
    type: () => [Product],
  })
  @ManyToMany(() => Product)
  @JoinTable({
    name: 'ORDER_DETAILS_PRODUCTS',
  })
  products: Product[];
}