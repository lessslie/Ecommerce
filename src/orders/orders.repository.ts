import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from '../entities/orderDetails.entity';
import { Order } from '../entities/orders.entity';
import { Product } from '../entities/products.entity';
import { User } from '../entities/users.entity';

import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

 
  //     if (isAdmin) {
  //         // Si es admin, retorna todas las órdenes
  //         return this.ordersRepository.find({
  //             relations: {
  //                 user: true,
  //                 orderDetails: {
  //                     products: true,
  //                 },
  //             },
  //         });
  //     } else {
  //         // Si es usuario normal, solo sus órdenes
  //         return this.ordersRepository.find({
  //             where: { user: { id: userId } },
  //             relations: {
  //                 user: true,
  //                 orderDetails: {
  //                     products: true,
  //                 },
  //             },
  //         });
  //     }
  // }
  // En orders.repository.ts
  // async getOrders(userId?: string, isAdmin?: boolean): Promise<Order[]> {
  //   if (isAdmin) {
  //     return this.ordersRepository.find({
  //       relations: {
  //         user: true,
  //         orderDetails: {
  //           products: true,
  //         },
  //       },
  //       select: {
  //         user: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           phone: true,
  //           country: true,
  //           address: true,
  //           city: true,
  //           isAdmin: true,
  //           // No incluimos password
  //         },
  //       },
  //     });
  //   } else {
  //     return this.ordersRepository.find({
  //       where: { user: { id: userId } },
  //       relations: {
  //         user: true,
  //         orderDetails: {
  //           products: true,
  //         },
  //       },
  //       select: {
  //         user: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           phone: true,
  //           country: true,
  //           address: true,
  //           city: true,
  //           isAdmin: true,
  //           // No incluimos password
  //         },
  //       },
  //     });
  //   }
  // }
  async getOrders(userId?: string, isAdmin?: boolean): Promise<Order[]> {
    const baseQuery = this.ordersRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.orderDetails', 'orderDetails')
        .leftJoinAndSelect('orderDetails.products', 'products')
        .select([
            'order.id',
            'order.date',
            'user.id',
            'user.name',
            'user.email',
            'user.phone',
            'user.country',
            'user.address',
            'user.city',
            'user.isAdmin',
            'orderDetails',
            'products'
        ]);

    if (!isAdmin) {
        baseQuery.where('user.id = :userId', { userId });
    }

    const orders = await baseQuery.getMany();
    return orders.filter(order => order.orderDetails !== null);
}

  async getOrder(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });
    if (!order) throw new Error(`No se encontro ninguna orden para ese id`);
    return order;
  }

//   async addOrder(userId: string, products: Partial<Product>[]): Promise<Order> {
//     let totalPrice = 0;
//     const user = await this.usersRepository.findOneBy({ id: userId });
//     if (!user) {
//       throw new Error(`User not found`);
//     }

//     const order = new Order();
//     order.date = new Date();
//     order.user = user;

//     const newOrder = await this.ordersRepository.save(order);
//     const orderDetail = new OrderDetail();
//     orderDetail.order = newOrder;

//     const productsArray: Product[] = await Promise.all(
//       products.map(async (product) => {
//         const existingproduct = await this.productRepository.findOneBy({
//           id: product.id,
//         });

//         if (!existingproduct) {
//           throw new Error(`Product ${product.id} not found`);
//         }

//         if (existingproduct.stock < 1) {
//           throw new HttpException(
//             `No hay stock suficiente del producto "${existingproduct.name}". Stock actual: ${existingproduct.stock}`,
//             HttpStatus.BAD_REQUEST,
//           );
//         }

//         // Actualizar precio total
//         totalPrice += Number(existingproduct.price);

//         // Guardar nombre y precio del producto
//         const productInfo = {
//           name: existingproduct.name,
//           price: existingproduct.price,
//         };

//         // Actualizar stock
//         await this.productRepository.update(
//           { id: product.id },
//           { stock: existingproduct.stock - 1 },
//         );
//         return existingproduct;
//       }),
//     );

//     // Formato correcto del precio total
//     orderDetail.price = Number(totalPrice.toFixed(2));

//     // Guardar nombres y precios de productos
//     orderDetail.productName = productsArray.map((p) => p.name).join(', ');
//     orderDetail.productPrice = orderDetail.price; // Guardamos el precio total
//     orderDetail.products = productsArray;

//     await this.orderDetailsRepository.save(orderDetail);

//     // Retornar orden con relaciones
//     const finalOrder = await this.ordersRepository.findOne({
//       where: { id: newOrder.id },
//       relations: {
//           orderDetails: {
//               products: true
//           },
//           user: true
//       },
//       select: {
//         user: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//             country: true,
//             address: true,
//             city: true,
//             isAdmin: true
//         }
//     }
// }); if (!finalOrder) {
//   throw new HttpException(
//       'No se encontró la orden recién creada',
//       HttpStatus.NOT_FOUND
//   );
// }
// return finalOrder;
// }
async addOrder(userId: string, products: Partial<Product>[]): Promise<Order> {
  const user = await this.usersRepository.findOneBy({ id: userId });
  if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
  }

  const order = new Order();
  order.date = new Date();
  order.user = user;

  const newOrder = await this.ordersRepository.save(order);

  const orderDetail = new OrderDetail();
  orderDetail.order = newOrder;
  const productNames: string[] = [];
  let totalPrice = 0;

  const productsArray = await Promise.all(
      products.map(async (product) => {
          const existingProduct = await this.productRepository.findOneBy({ id: product.id });
          if (!existingProduct) {
              throw new HttpException(`Producto no encontrado: ${product.id}`, HttpStatus.NOT_FOUND);
          }
          if (existingProduct.stock < 1) {
              throw new HttpException(
                  `No hay stock suficiente del producto "${existingProduct.name}". Stock actual: ${existingProduct.stock}`,
                  HttpStatus.BAD_REQUEST
              );
          }
          productNames.push(existingProduct.name);
          totalPrice += Number(existingProduct.price);

          // Actualizar stock
          await this.productRepository.update(
              { id: product.id },
              { stock: existingProduct.stock - 1 }
          );

          return existingProduct;
      })
  );

  orderDetail.productName = productNames.join(', ');
  orderDetail.productPrice = Number(totalPrice.toFixed(2));
  orderDetail.price = Number(totalPrice.toFixed(2));
  orderDetail.products = productsArray;
  await this.orderDetailsRepository.save(orderDetail);

  const finalOrder = await this.ordersRepository.findOne({
      where: { id: newOrder.id },
      relations: {
          orderDetails: {
              products: true
          },
          user: true
        },
        select: {
            id: true,
            date: true,
            status: true,
            user: {
                id: true,
                name: true,
                email: true,
                phone: true,
                country: true,
                address: true,
                city: true,
                isAdmin: true
              }
  }
});

  if (!finalOrder) {
      throw new HttpException('Error al crear la orden', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return finalOrder;
}

// async deleteOrder(id: string): Promise<string> {
//   const order = await this.ordersRepository.findOne({
//     where: { id },
//     relations: {
//       orderDetails: true,
//       user: true
//     }
//   });
  
//   if (!order) {
//     throw new HttpException(
//       'Orden no encontrada',
//       HttpStatus.NOT_FOUND
//     );
//   }
//   // Primero eliminamos los orderDetails asociados
//   if (order.orderDetails) {
//     await this.orderDetailsRepository.remove(order.orderDetails);
//   }
//   // Luego eliminamos la orden
//   await this.ordersRepository.remove(order);
  
//   return `Orden eliminada exitosamente`;
// }
async deleteOrder(id: string): Promise<string> {
  const order = await this.ordersRepository.findOne({
      where: { id }
  });

  if (!order) {
      throw new NotFoundException('Orden no encontrada');
  }

  order.status = 'cancelled';
  await this.ordersRepository.save(order);

  return `Orden ${id} cancelada exitosamente`;
}

}