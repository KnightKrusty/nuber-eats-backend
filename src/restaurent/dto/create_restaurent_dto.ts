import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurent } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurentDto extends OmitType(Restaurent, ['id']) {}
