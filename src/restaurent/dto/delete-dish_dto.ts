import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteDishInput {
  @Field((type) => Int)
  dishId: number;
}

@ObjectType()
export class DeleteDishOutput extends MutationOutput {}
