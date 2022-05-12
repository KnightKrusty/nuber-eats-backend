import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountOutput } from 'src/users/dto/create-account-dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurentInput } from './dto/create_restaurent_dto';
import { Category } from './entities/category.entity';

import { Restaurent } from './entities/restaurant.entity';

@Injectable()
export class RestaurentService {
  constructor(
    @InjectRepository(Restaurent)
    private readonly restaurents: Repository<Restaurent>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async createRestaurent(
    owner: User,
    createRestaurentInput: CreateRestaurentInput,
  ): Promise<CreateAccountOutput> {
    try {
      const newRestaurent = this.restaurents.create(createRestaurentInput);
      newRestaurent.owner = owner;
      const categoryName = createRestaurentInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({ slug: categorySlug });

      if (!category) {
        category = await this.categories.save(
          this.categories.create({ slug: categorySlug, name: categoryName }),
        );
      }

      newRestaurent.category = category;
      console.log(newRestaurent);
      await this.restaurents.save(newRestaurent);

      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'Could not create restaurent',
      };
    }
  }
}
