// src/products/products.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from '../entities/products.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: jest.Mocked<ProductsRepository>;

  const mockProduct: Partial<Product> = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    stock: 10,
    imgUrl: 'https://default-image-url.com/placeholder.jpg',
    category: { id: '1', name: 'Test Category' } as any,
    orderDetails: []
  };

  beforeEach(async () => {
    const mockProductsRepository = {
      getProducts: jest.fn(),
      getProduct: jest.fn(),
      updateProduct: jest.fn(),
      addProduct: jest.fn(),
      deleteProduct: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(ProductsRepository);
  });

  describe('getProductsService', () => {
    it('debería devolver productos paginados', async () => {
      repository.getProducts.mockResolvedValue([mockProduct as Product]);
      
      const result = await service.getProductsService(1, 10);
      
      expect(result).toHaveLength(1);
      expect(repository.getProducts).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('updateProduct', () => {
    it('debería actualizar el producto correctamente', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 200
      };

      repository.updateProduct.mockResolvedValue('1');

      const result = await service.updateProduct('1', updateData);
      
      expect(result).toBe('1');
      expect(repository.updateProduct).toHaveBeenCalledWith('1', updateData);
    });
  });
});