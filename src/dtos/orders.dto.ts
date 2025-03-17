import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsUUID,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Product } from 'src/entities/products.entity';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'User ID,id del usuario que esta creando la orden de compra',
    example: '6883628b-bfef-415c-beb7-a043b5df350b',
  })
  userId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Array de productos que se van a comprar',
  })
  products: Partial<Product>[];
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Asus ZenBook Pro',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Laptop con procesador Intel Core i9, 32GB RAM, 1TB SSD, pantalla 16 pulgadas',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1899.99,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 15,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  stock?: number;
}