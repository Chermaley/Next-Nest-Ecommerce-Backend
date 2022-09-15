import { Module } from '@nestjs/common';
import { AmoCrmService } from './amo-crm.service';
import { AmoCrmAuthToken } from './models/amo-crm-auth-token.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [AmoCrmService],
  imports: [SequelizeModule.forFeature([AmoCrmAuthToken])],
  exports: [AmoCrmService],
})
export class AmoCrmModule {}
