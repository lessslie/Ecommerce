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
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiBody({ 
    type: CreateOrderDto,
    description: 'Datos necesarios para crear una orden'
  })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    schema: {
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        status: { type: 'string', example: 'active' },
        date: { type: 'string', format: 'date-time', example: '2023-09-15T14:30:00Z' },
        orderDetails: { 
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
            price: { type: 'number', example: 1299.99 }
          }
        },
        user: { 
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
            name: { type: 'string', example: 'Juan Pérez' }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado - Se requiere autenticación' })
  @ApiBadRequestResponse({ description: 'Datos de la orden inválidos o sin stock suficiente' })
  @ApiNotFoundResponse({ description: 'Usuario o producto no encontrado' })
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

  @ApiOperation({ summary: 'Obtener todas las órdenes del usuario o todas si es admin' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes recuperada exitosamente',
    type: 'array'
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado - Se requiere autenticación' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  async getOrders(@Req() request) {
    const user = request.user;
    return this.ordersService.getOrders(user.id, user.isAdmin);
  }

  @ApiOperation({ summary: 'Obtener una orden específica por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
    schema: {
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        status: { type: 'string', example: 'active' },
        date: { type: 'string', format: 'date-time', example: '2023-09-15T14:30:00Z' },
        // Incluir más propiedades según el modelo de respuesta real
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'No autorizado - Se requiere autenticación' })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  getOrder(@Param('id', ParseUUIDPipe) orderId: string) {
    return this.ordersService.getOrder(orderId);
  }

  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiParam({
    name: 'id',
    description: 'ID único de la orden a eliminar (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Orden eliminada exitosamente',
    schema: {
      type: 'string',
      example: 'Orden eliminada correctamente'
    }
  })
  @ApiNotFoundResponse({ description: 'Orden no encontrada' })
  @ApiUnauthorizedResponse({ description: 'No autorizado - Se requiere autenticación' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string, @Req() request) {
    const user = request.user;
    const order = await this.ordersService.getOrder(id);

    return this.ordersService.deleteOrder(id);
  }
}