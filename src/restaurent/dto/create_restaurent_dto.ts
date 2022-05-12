import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { Restaurent } from '../entities/restaurant.entity';
import { MutationOutput } from '../../common/dto/output.dto';

@InputType()
export class CreateRestaurentInput extends PickType(Restaurent, [
  'name',
  'coverImage',
  'address',
]) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurentOutput extends MutationOutput {}
