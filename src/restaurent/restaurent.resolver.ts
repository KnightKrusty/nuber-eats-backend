import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dto/all-categories_dto';
import { CategoryInput, CategoryOutput } from './dto/category_dto';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish_dto';
import {
  CreateRestaurentInput,
  CreateRestaurentOutput,
} from './dto/create_restaurent_dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish_dto';
import {
  DeleteRestaurentInput,
  DeleteRestaurentOutput,
} from './dto/delete_restaurent_dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish_dto';
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
import { Dish } from './entities/dish.entity';
import { Restaurent } from './entities/restaurant.entity';
import { RestaurentService } from './restaurent.service';

@Resolver(() => Restaurent)
export class RestaurentResolver {
  constructor(private readonly restaurenService: RestaurentService) {}

  @Mutation((returns) => CreateRestaurentOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurentInput: CreateRestaurentInput,
  ): Promise<CreateRestaurentOutput> {
    console.log(authUser);
    return this.restaurenService.createRestaurent(
      authUser,
      createRestaurentInput,
    );
  }

  @Mutation((returns) => EditRestaurentOutput)
  @Role(['Owner'])
  editRestaurent(
    @AuthUser() owner: User,
    @Args('input') editRestaurentInput: EditRestaurentInput,
  ): Promise<EditRestaurentOutput> {
    return this.restaurenService.editRestaurent(owner, editRestaurentInput);
  }

  @Mutation((returns) => DeleteRestaurentOutput)
  @Role(['Owner'])
  deleteRestaurent(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurentInput: DeleteRestaurentInput,
  ): Promise<DeleteRestaurentOutput> {
    return this.restaurenService.deleteRestaurent(owner, deleteRestaurentInput);
  }

  @Query((returns) => RestaurentsOutput)
  restaurents(
    @Args('input') restaurentInput: RestaurentsInput,
  ): Promise<RestaurentsOutput> {
    return this.restaurenService.allRestaurents(restaurentInput);
  }

  @Query((returns) => RestaurentOutput)
  restaurent(
    @Args('input') restaurentInput: RestaurentInput,
  ): Promise<RestaurentOutput> {
    return this.restaurenService.findRestaurentById(restaurentInput);
  }

  @Query((returns) => SearchRestaurentOutput)
  async searchRestaurent(
    @Args('input') searchRestaurentInput: SearchRestaurentInput,
  ): Promise<SearchRestaurentOutput> {
    return this.restaurenService.searchRestaurentByName(searchRestaurentInput);
  }
}

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly restaurentService: RestaurentService) {}

  @ResolveField((type) => Int)
  restaurentCount(@Parent() category: Category): Promise<number> {
    return this.restaurentService.countRestaurent(category);
  }

  @Query((type) => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurentService.allCategories();
  }

  @Query((type) => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurentService.findCategoryBySlug(categoryInput);
  }
}

@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly restaurenService: RestaurentService) {}

  @Mutation((type) => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.restaurenService.createDish(owner, createDishInput);
  }

  @Mutation((type) => EditDishOutput)
  @Role(['Owner'])
  editDish(
    @AuthUser() owner: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.restaurenService.editDish(owner, editDishInput);
  }

  @Mutation((type) => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.restaurenService.deleteDish(owner, deleteDishInput);
  }
}
