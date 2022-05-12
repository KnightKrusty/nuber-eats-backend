import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Category } from './category.entity';

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

  @RelationId((restaurent: Restaurent) => restaurent.owner)
  ownerId: number;
}
