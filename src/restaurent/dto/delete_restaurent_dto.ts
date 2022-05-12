import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteRestaurentInput {
  @Field((type) => Number)
  restaurentId: number;
}

@ObjectType()
export class DeleteRestaurentOutput extends MutationOutput {}
