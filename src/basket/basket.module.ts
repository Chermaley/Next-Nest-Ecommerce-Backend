import { Module } from '@nestjs/common';
import { Product } from '../products/products.model';
import { User } from '../users/users.model';

@Module({
  imports: [Product, User],
})
export class BasketModule {}
