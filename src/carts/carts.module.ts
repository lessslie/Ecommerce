import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Product } from 'src/entities/products.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    OrdersModule, // Necesario para usar OrdersService en CartsService
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
