import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination_dto';
import { Restaurent } from '../entities/restaurant.entity';

@InputType()
export class SearchRestaurentInput extends PaginationInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchRestaurentOutput extends PaginationOutput {
  @Field((type) => [Restaurent], { nullable: true })
  restaurents?: Restaurent[];
}
