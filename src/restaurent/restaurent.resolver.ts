import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurentDto } from './dto/create_restaurent_dto';
import { UpdateRestaurentDto } from './dto/updateRestaurent_dto';
import { Restaurent } from './entities/restaurant.entity';
import { RestaurentService } from './restaurent.service';

@Resolver(() => Restaurent)
export class RestaurentResolver {
  constructor(private readonly restaurenService: RestaurentService) {}

  @Query(() => [Restaurent])
  restaurants(): Promise<Restaurent[]> {
    return this.restaurenService.getAll();
  }

  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('input') createRestaurentDto: CreateRestaurentDto,
  ): Promise<boolean> {
    try {
      await this.restaurenService.createRestaurent(createRestaurentDto);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async updateRestaurent(
    @Args('input') updateRestaurent: UpdateRestaurentDto,
  ): Promise<boolean> {
    try {
      await this.restaurenService.updateRestaurent(updateRestaurent);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
