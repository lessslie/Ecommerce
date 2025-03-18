// src/carts/carts.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CartsService } from './carts.service';
import { AddToCartDto } from 'src/dtos/carts.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'Obtener el carrito del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Contenido del carrito obtenido exitosamente',
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  async getCart(@Req() request) {
    const userId = request.user.id;
    return this.cartsService.getCart(userId);
  }

  @ApiOperation({ summary: 'Añadir un producto al carrito' })
  @ApiBody({
    type: AddToCartDto,
    description: 'Producto a añadir al carrito',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto añadido al carrito exitosamente',
  })
  @ApiBearerAuth()
  @Post('items')
  @UseGuards(AuthGuard)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Req() request) {
    const userId = request.user.id;
    return this.cartsService.addToCart(userId, addToCartDto);
  }

  @ApiOperation({ summary: 'Eliminar un producto del carrito' })
  @ApiParam({
    name: 'productId',
    description: 'ID del producto a eliminar del carrito',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado del carrito exitosamente',
  })
  @ApiBearerAuth()
  @Delete('items/:productId')
  @UseGuards(AuthGuard)
  async removeFromCart(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Req() request,
  ) {
    const userId = request.user.id;
    return this.cartsService.removeFromCart(userId, productId);
  }

  @ApiOperation({ summary: 'Convertir el carrito en una orden' })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente a partir del carrito',
  })
  @ApiBearerAuth()
  @Post('checkout')
  @UseGuards(AuthGuard)
  async checkout(@Req() request) {
    const userId = request.user.id;
    return this.cartsService.checkout(userId);
  }
}
