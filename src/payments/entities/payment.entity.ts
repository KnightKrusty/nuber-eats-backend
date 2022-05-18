import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurent } from 'src/restaurent/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field((type) => String)
  @Column()
  transactionId: string;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.payments)
  user?: User;

  @RelationId((order: Payment) => order.user)
  userId: number;

  @Field((type) => Restaurent)
  @ManyToOne((type) => Restaurent)
  restaurent: Restaurent;

  @Field((type) => Int)
  @RelationId((payment: Payment) => payment.restaurent)
  restaurentId: number;
}
