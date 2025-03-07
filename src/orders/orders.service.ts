import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "./orders.repository";
import { Product } from "../entities/products.entity";


@Injectable()
export class OrdersService{

    constructor(
        private readonly ordersRepository: OrdersRepository
    ){}
addOrder(userId: string, products: Partial<Product>[]){
    return this.ordersRepository.addOrder(userId, products)
}


async getOrders(userId: string, isAdmin: boolean) {
    return this.ordersRepository.getOrders(userId, isAdmin);
}

getOrder(id: string){
    return this.ordersRepository.getOrder(id);
}

async deleteOrder(id: string) {
    return await this.ordersRepository.deleteOrder(id);
}



}