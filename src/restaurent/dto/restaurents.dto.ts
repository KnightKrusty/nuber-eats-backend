import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination_dto';
import { Restaurent } from '../entities/restaurant.entity';

@InputType()
export class RestaurentsInput extends PaginationInput {}

@ObjectType()
export class RestaurentsOutput extends PaginationOutput {
  @Field((type) => [Restaurent], { nullable: true })
  results?: Restaurent[];
}
