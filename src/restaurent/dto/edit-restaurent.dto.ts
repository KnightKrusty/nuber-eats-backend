import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { CreateRestaurentInput } from './create_restaurent_dto';

@InputType()
export class EditRestaurentInput extends PartialType(CreateRestaurentInput) {
  @Field((type) => Number)
  restaurentID: number;
}

@ObjectType()
export class EditRestaurentOutput extends MutationOutput {}
