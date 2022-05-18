import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Restaurent } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import {
  CategoryResolver,
  DishResolver,
  RestaurentResolver,
} from './restaurent.resolver';
import { RestaurentService } from './restaurent.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurent, Dish, CategoryRepository])],
  providers: [
    RestaurentResolver,
    CategoryResolver,
    DishResolver,
    RestaurentService,
  ],
})
export class RestaurentModule {}
