import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dtos/orders.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.addOrder(
        createOrderDto.userId,
        createOrderDto.products,
      );
    } catch (error) {
      console.log('Error detallado en createOrder:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Si es una HttpException, mantener el mensaje original
      if (error instanceof HttpException) {
        throw error;
      }

      // Para otros tipos de errores, manejar según el mensaje
      if (error.message?.includes('User not found')) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      if (error.message?.includes('Product not found')) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      if (error.message?.includes('No hay stock')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      console.log('Error no manejado:', error);
      throw new HttpException(
        `Error al crear la orden: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  async getOrders(@Req() request) {
    const user = request.user;
    return this.ordersService.getOrders(user.id, user.isAdmin);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  getOrder(@Param('id', ParseUUIDPipe) orderId: string) {
    return this.ordersService.getOrder(orderId);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string, @Req() request) {
    const user = request.user;
    const order = await this.ordersService.getOrder(id);

    return this.ordersService.deleteOrder(id);
  }
}
