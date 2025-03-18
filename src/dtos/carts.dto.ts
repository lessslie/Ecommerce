// src/dtos/carts.dto.ts
import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID del producto a añadir al carrito',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Cantidad del producto a añadir',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  @IsNotEmpty()
  quantity: number;
}

export class CartItemDto {
  @ApiProperty({
    description: 'ID del producto en el carrito',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Asus ZenBook',
  })
  name: string;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Cantidad del producto en el carrito',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Subtotal para este producto',
    example: 2599.98,
  })
  subtotal: number;
}

export class CartDto {
  @ApiProperty({
    description: 'ID del usuario propietario del carrito',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Productos en el carrito',
    type: [CartItemDto],
  })
  items: CartItemDto[];

  @ApiProperty({
    description: 'Total del carrito',
    example: 2599.98,
  })
  total: number;
}