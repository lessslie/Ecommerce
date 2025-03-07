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

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({
    nullable: true,
    type: 'text',
    default: 'https://assets.soyhenry.com/LOGO-REDES-01_og.jpg',
  })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  @ManyToMany(() => OrderDetail, (orderderDetail) => orderderDetail.products)
  orderDetails: OrderDetail[];

  @JoinColumn({ name: 'category_id' })
  category: Category;
}
