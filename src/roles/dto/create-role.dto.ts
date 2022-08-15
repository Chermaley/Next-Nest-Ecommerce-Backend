import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Название роли.',
  })
  readonly value: string;
  @ApiProperty({ example: 'Самый главный.', description: 'Описание роли.' })
  readonly description: string;
}
