import { Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dto/output.dto';
import { Payment } from '../entities/payment.entity';

@ObjectType()
export class GetPaymentsOutput extends MutationOutput {
  @Field((type) => [Payment], { nullable: true })
  payments?: Payment[];
}
