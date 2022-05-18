import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurent } from 'src/restaurent/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import {
  CreatePaymentInput,
  CreatePaymentOuput,
} from './dto/create-payment.dto';
import { GetPaymentsOutput } from './dto/get-payments.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurent)
    private readonly restaurents: Repository<Restaurent>,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurentId }: CreatePaymentInput,
  ): Promise<CreatePaymentOuput> {
    try {
      const restaurent = await this.restaurents.findOne(restaurentId);
      if (!restaurent) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (restaurent.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You are not allowed to do this.',
        };
      }
      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurent,
        }),
      );
      // restaurent.isPromoted = true;
      // const date = new Date();
      // date.setDate(date.getDate() + 7);
      // restaurent.promotedUntil = date;

      this.restaurents.save(restaurent);
      return {
        ok: true,
      };
    } catch {
      return { ok: false, error: 'Could not create payment.' };
    }
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({ user: user });
      return {
        ok: true,
        payments,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load payments.',
      };
    }
  }

  //   async checkPromotedRestaurants() {
  //     const restaurants = await this.restaurants.find({
  //       isPromoted: true,
  //       promotedUntil: LessThan(new Date()),
  //     });
  //     console.log(restaurants);
  //     restaurants.forEach(async (restaurant) => {
  //       restaurant.isPromoted = false;
  //       restaurant.promotedUntil = null;
  //       await this.restaurants.save(restaurant);
  //     });
  //   }
}
