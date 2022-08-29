import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles.model';
import { Basket } from '../basket/basket.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Basket) private basketRepository: typeof Basket,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const userList = await this.userRepository.findAll();
    const user = await this.userRepository.create(dto);
    const roles: Role[] = [];
    if (userList.length === 0) {
      const adminRole = await this.roleService.getRoleByValue('ADMIN');
      roles.push(adminRole);
    }
    const userRole = await this.roleService.getRoleByValue('USER');
    const basket = await this.basketRepository.create({ userId: user.id });
    roles.push(userRole);
    await user.$set('roles', [...roles]);
    await user.$set('basket', basket);
    user.roles = roles;
    user.basket = basket;
    return user;
  }

  async getAllUsers() {
    return await this.userRepository.findAll({ include: { all: true } });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async updateUserById(userId: number, values: Partial<User>) {
    await this.userRepository.update(
      { ...values },
      {
        where: { id: userId },
      },
    );
  }
}
