// src/carts/carts.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDto, CartDto, CartItemDto } from 'src/dtos/carts.dto';
import { Product } from 'src/entities/products.entity';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class CartsService {
  // Aquí usamos un mapa en memoria para simplificar, pero en producción
  // deberías usar una entidad en la base de datos
  private carts = new Map<string, CartDto>();

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private ordersService: OrdersService,
  ) {}

  async getCart(userId: string): Promise<CartDto> {
    // Recuperar o inicializar el carrito del usuario
    if (!this.carts.has(userId)) {
      this.carts.set(userId, {
        userId,
        items: [],
        total: 0,
      });
    }

    return this.carts.get(userId)!;
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartDto> {
    const { productId, quantity } = addToCartDto;

    // Verificar que el producto existe y tiene stock
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `No hay stock suficiente. Stock disponible: ${product.stock}`,
      );
    }

    // Obtener el carrito actual
    const cart = await this.getCart(userId);

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (existingItemIndex !== -1) {
      // Actualizar cantidad si el producto ya está en el carrito
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal =
        cart.items[existingItemIndex].price *
        cart.items[existingItemIndex].quantity;
    } else {
      // Añadir nuevo item al carrito
      const cartItem: CartItemDto = {
        productId,
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      };
      cart.items.push(cartItem);
    }

    // Recalcular el total del carrito
    cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);

    // Guardar el carrito actualizado
    this.carts.set(userId, cart);

    return cart;
  }

  async removeFromCart(userId: string, productId: string): Promise<CartDto> {
    // Obtener el carrito actual
    const cart = await this.getCart(userId);

    // Encontrar el índice del producto en el carrito
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Producto no encontrado en el carrito');
    }

    // Eliminar el producto del carrito
    cart.items.splice(itemIndex, 1);

    // Recalcular el total
    cart.total = cart.items.reduce((total, item) => total + item.subtotal, 0);

    // Guardar el carrito actualizado
    this.carts.set(userId, cart);

    return cart;
  }

  async checkout(userId: string): Promise<any> {
    // Obtener el carrito actual
    const cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    // Formatear los productos para la creación de orden
    const orderProducts = cart.items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }));

    // Crear la orden usando el servicio de órdenes existente
    const order = await this.ordersService.addOrder(userId, orderProducts);

    // Limpiar el carrito después de crear la orden
    this.carts.set(userId, {
      userId,
      items: [],
      total: 0,
    });

    return {
      message: 'Orden creada exitosamente',
      order,
    };
  }
}
