import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const userList = await this.userRepository.findAll();
    const user = await this.userRepository.create(dto);
    const roles: Role[] = [];
    if (userList.length === 0) {
      const adminRole = await this.roleService.createRole({
        description: 'Администратор',
        value: 'ADMIN',
      });
      roles.push(adminRole);
      await this.roleService.createRole({
        description: 'Пользователь',
        value: 'USER',
      });
    }
    const userRole = await this.roleService.getRoleByValue('USER');
    roles.push(userRole);
    await user.$set('roles', [...roles]);
    user.roles = roles;
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
