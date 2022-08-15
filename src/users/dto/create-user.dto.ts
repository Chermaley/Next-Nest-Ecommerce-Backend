import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Почтовый адресс пользователя.',
  })
  readonly email: string;
  @ApiProperty({ example: '123121u', description: 'Пароль пользователя.' })
  readonly password: string;
}
