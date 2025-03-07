import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from 'src/dtos/orders.dto';
import { Category } from 'src/entities/categories.entity';
import { Product } from 'src/entities/products.entity';
import { preload } from 'src/helpers/preload';
import { OrderDetail } from 'src/entities/orderDetails.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/products.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  async getProducts(page: number, limit: number): Promise<Product[]> {
    console.log('productos solicitados por pagina:', page, 'limit:', limit);

    const [products, total] = await this.productsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (total === 0) {
      console.log('No hay stock del producto solicitado');
      return [];
    }

    console.log(`hay ${total} productos disponibles`);
    return products;
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(
        `El producto con ID ${id} no fue encontrado o noexiste`,
      );
    }
    return product;
  }



  async updateProduct(
    id: string,
    updateData: UpdateProductDto,
  ): Promise<string> {
    console.log('ID del producto a actualizar:', id);

    const productToUpdate = await this.productsRepository.findOneBy({ id });
    if (!productToUpdate) {
      throw new Error('Producto no encontrado');
    }

    try {
      const updatedProduct = await this.productsRepository.save({
        ...productToUpdate, // mantener datos existentes
        ...updateData, // aplicar actualizaciones
      });
      console.log('Producto antes de actualizar:', productToUpdate);
      console.log('Datos recibidos para actualizar:', updateData);

      return updatedProduct.id;
    } catch (error) {
      console.error('Error en actualización:', error);
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async addProduct(productDto: CreateProductDto): Promise<Product> {
    // Crear una nueva instancia de Product con los datos del DTO
    const product = this.productsRepository.create({
      ...productDto,
      imgUrl:
        productDto.imgUrl || 'https://default-image-url.com/placeholder.jpg',
    });
    return await this.productsRepository.save(product);
  }

  async deleteProduct(id: string): Promise<string> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    await this.productsRepository.delete(id);
    return `Producto eliminado exitosamente: ${product.name} `;
  }

  async seedproducts(): Promise<string> {
    try {
      console.log('Starting seed process');
      const categories = await this.categoriesRepository.find();
      console.log('Found categories:', categories);

      if (categories.length === 0) {
        throw new Error(
          'No hay categorías disponibles para asignar a los productos',
        );
      }

      for (const element of preload) {
        console.log('Processing product:', element);

        const productCategory = categories.find(
          (category) => category.name === element.category,
        );

        if (!productCategory) {
          console.log(`Categoría no encontrada: ${element.category}`);
          continue;
        }

        const product = new Product();
        product.name = element.name;
        product.description = element.description;
        product.price = element.price;
        product.stock = element.stock;
        product.category = productCategory;

        console.log('Saving product:', product);

        await this.productsRepository
          .createQueryBuilder()
          .insert()
          .into(Product)
          .values(product)
          .orUpdate(['description', 'price', 'stock'], ['name'])
          .execute();
      }

      return 'Products added successfully';
    } catch (error) {
      console.error('Error in seedproducts:', error);
      throw new Error(`Error seeding products: ${error.message}`);
    }
  }
}
