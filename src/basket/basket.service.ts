import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Basket } from './basket.model';

@Injectable()
export class BasketService {
  constructor(@InjectModel(Basket) private basketRepository: typeof Basket) {}
  async create() {
    return await this.basketRepository.create();
  }
}
