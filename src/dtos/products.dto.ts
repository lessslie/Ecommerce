// src/dtos/products.dto.ts
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Asus ZenBook',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Laptop con procesador Intel Core i7, 16GB RAM, 512GB SSD, pantalla 14 pulgadas',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 25,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://assets.soyhenry.com/LOGO-REDES-01_og.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imgUrl?: string;
}