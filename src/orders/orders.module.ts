import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/restaurent/entities/dish.entity';
import { Restaurent } from 'src/restaurent/entities/restaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entities';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurent, Dish, OrderItem])],
  providers: [OrderService, OrderResolver],
})
export class OrdersModule {}
