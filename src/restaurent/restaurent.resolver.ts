import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateRestaurentInput,
  CreateRestaurentOutput,
} from './dto/create_restaurent_dto';
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
}
