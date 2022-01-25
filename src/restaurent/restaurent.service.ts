import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurentDto } from './dto/create_restaurent_dto';
import { UpdateRestaurentDto } from './dto/updateRestaurent_dto';
import { Restaurent } from './entities/restaurant.entity';

@Injectable()
export class RestaurentService {
  constructor(
    @InjectRepository(Restaurent)
    private readonly restaurents: Repository<Restaurent>,
  ) {}

  getAll(): Promise<Restaurent[]> {
    return this.restaurents.find();
  }

  createRestaurent(
    createRestaurentDto: CreateRestaurentDto,
  ): Promise<Restaurent> {
    const newRestaurent = this.restaurents.create(createRestaurentDto);
    return this.restaurents.save(newRestaurent);
  }

  updateRestaurent({ id, data }: UpdateRestaurentDto) {
    return this.restaurents.update(id, { ...data });
  }
}
