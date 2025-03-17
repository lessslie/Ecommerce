import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { OrderDetail } from './orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'orders' })
export class Order {
  @ApiProperty({
    description: 'El identificador único del pedido',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Estado actual del pedido',
    example: 'active',
    enum: ['active', 'cancelled'],
    default: 'active',
  })
  @Column({ default: 'active' })
  status: 'active' | 'cancelled';

  @ApiProperty({
    description: 'Fecha en que se realizó el pedido',
    example: '2023-09-15T14:30:00Z',
    type: Date,
  })
  @Column()
  date: Date;
  
  @ApiProperty({
    description: 'Detalles del pedido',
    type: () => OrderDetail,
  })
  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail;
  
  @ApiProperty({
    description: 'Usuario que realizó el pedido',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}