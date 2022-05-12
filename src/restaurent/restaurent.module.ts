import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurent } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryResolver, RestaurentResolver } from './restaurent.resolver';
import { RestaurentService } from './restaurent.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurent, CategoryRepository])],
  providers: [RestaurentResolver, CategoryResolver, RestaurentService],
})
export class RestaurentModule {}
