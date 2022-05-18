import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entities';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurent extends CoreEntity {
  @Field((_type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((_type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((_type) => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field((_type) => Category, { nullable: true })
  @ManyToOne((_type) => Category, (category) => category.restaurent, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((_type) => User)
  @ManyToOne((_type) => User, (user) => user.restaurent, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.restaurent)
  orders: Order[];

  @RelationId((restaurent: Restaurent) => restaurent.owner)
  ownerId: number;

  @Field((type) => [Dish])
  @OneToMany((type) => Dish, (dish) => dish.restaurent)
  menu: Dish[];
}
