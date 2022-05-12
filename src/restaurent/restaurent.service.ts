import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountOutput } from 'src/users/dto/create-account-dto';
import { User } from 'src/users/entities/user.entity';
import { ILike, Like, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dto/all-categories_dto';
import { CategoryInput, CategoryOutput } from './dto/category_dto';
import { CreateRestaurentInput } from './dto/create_restaurent_dto';
import {
  DeleteRestaurentInput,
  DeleteRestaurentOutput,
} from './dto/delete_restaurent_dto';
import {
  EditRestaurentInput,
  EditRestaurentOutput,
} from './dto/edit-restaurent.dto';
import { RestaurentsInput, RestaurentsOutput } from './dto/restaurents.dto';
import { RestaurentInput, RestaurentOutput } from './dto/restaurent_dto';
import {
  SearchRestaurentInput,
  SearchRestaurentOutput,
} from './dto/search-restaurent_dto';
import { Category } from './entities/category.entity';
import { Restaurent } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurentService {
  constructor(
    @InjectRepository(Restaurent)
    private readonly restaurents: Repository<Restaurent>,
    private readonly categories: CategoryRepository,
  ) {}

  async createRestaurent(
    owner: User,
    createRestaurentInput: CreateRestaurentInput,
  ): Promise<CreateAccountOutput> {
    try {
      const newRestaurent = this.restaurents.create(createRestaurentInput);
      newRestaurent.owner = owner;

      const category = await this.categories.gerOrCreate(
        createRestaurentInput.categoryName,
      );

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

  async editRestaurent(
    owner: User,
    editRestaurentInput: EditRestaurentInput,
  ): Promise<EditRestaurentOutput> {
    try {
      const restaurent = await this.restaurents.findOne(
        editRestaurentInput.restaurentID,
      );

      if (!restaurent) {
        return {
          ok: false,
          error: 'Restaurent Not found',
        };
      }

      if (owner.id !== restaurent.ownerId) {
        return {
          ok: false,
          error: 'You cant edit a restaurent, you dont own',
        };
      }

      let category: Category = null;
      if (editRestaurentInput.categoryName) {
        category = await this.categories.gerOrCreate(
          editRestaurentInput.categoryName,
        );
      }

      await this.restaurents.save([
        {
          id: editRestaurentInput.restaurentID,
          ...editRestaurentInput,
          ...(category && { category }),
        },
      ]);

      return { ok: true };
    } catch {
      return { ok: false, error: 'Could not edit Restaurent' };
    }
  }

  async deleteRestaurent(
    owner: User,
    { restaurentId }: DeleteRestaurentInput,
  ): Promise<DeleteRestaurentOutput> {
    try {
      const restaurent = await this.restaurents.findOne(restaurentId);

      if (!restaurent) {
        return {
          ok: false,
          error: 'Restaurent Not found',
        };
      }

      if (owner.id !== restaurent.ownerId) {
        return {
          ok: false,
          error: 'You cant delete a restaurent, you dont own',
        };
      }

      await this.restaurents.delete(restaurentId);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }

  async countRestaurent(category: Category): Promise<number> {
    return await this.restaurents.count({ category });
  }

  // async findCategoryBySlug({ slug, page }: CategoryInput) {
  //   try {
  //     const category = await this.categories.findOne({ slug });

  //     if (!category) {
  //       return {
  //         ok: false,
  //         error: 'category not found',
  //       };
  //     }

  //     const restaurents = await this.restaurents.find({
  //       where: {
  //         category,
  //       },
  //       take: 5,
  //       skip: (page - 1) * 5,
  //     });

  //     category.restaurent = restaurents;
  //     const totalResults = await this.countRestaurent(category);

  //     return {
  //       ok: true,
  //       category,
  //       totalPages: Math.ceil(+totalResults / 5),
  //     };
  //   } catch (error) {
  //     return {
  //       ok: false,
  //       error: 'Could not load category',
  //     };
  //   }
  // }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const restaurent = await this.restaurents.find({
        where: {
          category,
        },
        take: 5,
        skip: (page - 1) * 5,
      });
      const totalResults = await this.countRestaurent(category);
      return {
        ok: true,
        restaurent,
        category,
        totalPages: Math.ceil(totalResults / 5),
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }

  async allRestaurents({ page }: RestaurentsInput): Promise<RestaurentsOutput> {
    try {
      const [restaurent, totalResults] = await this.restaurents.findAndCount({
        skip: (page - 1) * 5,
        take: 5,
      });

      return {
        ok: true,
        results: restaurent,
        totalPages: Math.ceil(totalResults / 5),
        totalResults,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load Restaurent',
      };
    }
  }

  async findRestaurentById({
    restaurentId,
  }: RestaurentInput): Promise<RestaurentOutput> {
    try {
      const restaurent = await this.restaurents.findOne(restaurentId);

      if (!restaurent) {
        return {
          ok: false,
          error: 'Restaurent Not found',
        };
      }

      return {
        ok: true,
        restaurent,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find restaurent',
      };
    }
  }

  async searchRestaurentByName({
    query,
    page,
  }: SearchRestaurentInput): Promise<SearchRestaurentOutput> {
    try {
      const [restaurents, totalResults] = await this.restaurents.findAndCount({
        where: {
          name: ILike(`%${query}%`),
        },
        skip: (page - 1) * 5,
        take: 5,
      });

      return {
        ok: true,
        restaurents,
        totalResults,
        totalPages: Math.ceil(totalResults / 5),
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not search the restaurent, Please try again',
      };
    }
  }
}
