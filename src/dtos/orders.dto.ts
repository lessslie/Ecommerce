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
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  stock?: number;
}