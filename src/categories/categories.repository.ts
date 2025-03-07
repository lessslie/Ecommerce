import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { preload } from '../helpers/preload';
import { Category } from 'src/entities/categories.entity';
import { PreloadItem } from 'src/interfaces/interfaces';

const preloadData: PreloadItem[] = preload as PreloadItem[];

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async addCategories(): Promise<string> {
    if (!preloadData || !Array.isArray(preloadData)) {
      throw new Error(
        'Los datos de preload no están disponibles o no son un array',
      );
    }

    await Promise.all(
      preloadData.map(async (element) => {
        await this.categoriesRepository
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values({ name: element.category })
          .orIgnore()
          .execute();
      }),
    );
    return 'Categories seeded';
  }
}
