import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Restaurent } from '../entities/restaurant.entity';

@InputType()
export class RestaurentInput {
  @Field((type) => Int)
  restaurentId: number;
}

@ObjectType()
export class RestaurentOutput extends MutationOutput {
  @Field((type) => Restaurent, { nullable: true })
  restaurent?: Restaurent;
}
