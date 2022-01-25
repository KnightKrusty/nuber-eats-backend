import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurentDto } from './create_restaurent_dto';

@InputType()
export class UpdateRestaurentInputType extends PartialType(
  CreateRestaurentDto,
) {}

@InputType()
export class UpdateRestaurentDto {
  @Field((_type) => Number)
  id: number;

  @Field((_type) => UpdateRestaurentInputType)
  data: UpdateRestaurentInputType;
}
