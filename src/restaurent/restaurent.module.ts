import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Restaurent } from './entities/restaurant.entity';
import { RestaurentResolver } from './restaurent.resolver';
import { RestaurentService } from './restaurent.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurent, Category])],
  providers: [RestaurentResolver, RestaurentService],
})
export class RestaurentModule {}
