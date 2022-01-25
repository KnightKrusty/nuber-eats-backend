import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurent } from './entities/restaurant.entity';
import { RestaurentResolver } from './restaurent.resolver';
import { RestaurentService } from './restaurent.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurent])],
  providers: [RestaurentResolver, RestaurentService],
})
export class RestaurentModule {}
