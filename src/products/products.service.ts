import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from 'src/entities/products.entity';
import { UpdateProductDto } from 'src/dtos/orders.dto';
import { CreateProductDto } from '../dtos/products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async getProductsService(page: number, limit: number): Promise<Product[]> {
    return this.productsRepository.getProducts(page, limit);
  }
////////////////////////


  async getProduct(id: string) {
    try {
      return await this.productsRepository.getProduct(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async addProduct(productDto: CreateProductDto) {
    const newProduct = await this.productsRepository.addProduct(productDto);
    return {
      message: 'Producto creado exitosamente',
      product: newProduct,
    };
  }

  async updateProduct(id: string, updateData: UpdateProductDto) {
    try {
      return await this.productsRepository.updateProduct(id, updateData);
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(id: string): Promise<string> {
    return this.productsRepository.deleteProduct(id);
  }

  seedProducts() {
    return this.productsRepository.seedproducts();
  }
}
