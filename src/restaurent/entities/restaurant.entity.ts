import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurent {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Field((_type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((_type) => Boolean, { defaultValue: true })
  @Column({ default: true })
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field((_type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((_type) => String)
  @Column()
  @IsString()
  ownerName: string;

  @Field((type) => String)
  @Column()
  @IsString()
  categoryName: string;
}
