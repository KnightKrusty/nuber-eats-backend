import { InputType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.entities';

@InputType()
export class OrderUpdatesInput extends PickType(Order, ['id']) {}
