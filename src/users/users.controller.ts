import {Controller, Get, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {User} from './users.model';
import {AtGuard} from '../common/guards';
import {GetCurrentUserId} from '../common/decorators';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Получить всех пользователей',
  })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({
    summary: 'Получить текущего пользователя',
  })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(AtGuard)
  @Get('/me')
  getCurrentUser(@GetCurrentUserId() userId: number) {
    return this.usersService.getUserById(userId);
  }
}
