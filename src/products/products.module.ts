import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./products.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/entities/products.entity";
import { Category } from "src/entities/categories.entity";
import { OrderDetail } from "src/entities/orderDetails.entity";




@Module({
    imports:[TypeOrmModule.forFeature([Product,Category,OrderDetail])
],
    controllers:[ProductsController],
    providers:[ProductsService,ProductsRepository],
})

export class ProductsModule {}