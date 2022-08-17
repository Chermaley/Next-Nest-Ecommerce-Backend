import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const userList = await this.userRepository.findAll();
    let role = await this.roleService.getRoleByValue('USER');
    if (userList.length === 0) {
      //Создание первых ролей
      //Первый пользователь всегда админ
      role = await this.roleService.createRole({
        description: 'Администратор',
        value: 'ADMIN',
      });
      await this.roleService.createRole({
        description: 'Пользователь',
        value: 'USER',
      });
    }
    const user = await this.userRepository.create(dto);
    await user.$set('roles', [role.id]);
    user.roles = [role];
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
}
