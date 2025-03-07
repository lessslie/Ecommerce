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

@Entity({ name: 'order_details' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'total_price', 
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;
 
  ////////////////////////////////
  ///agregue estos para  q cuando un admid actualize algun
  /// producto no afecte a las ordenes ya generadas

  @Column()
  productName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  productPrice: number;

  ////////////////////////////////////////////////////

  @OneToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  
  @ManyToMany(() => Product)
  @JoinTable({
    name: 'ORDER_DETAILS_PRODUCTS',
  })
  products: Product[];
}
