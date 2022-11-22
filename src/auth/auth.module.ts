import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  imports: [
    forwardRef(() => UsersModule),
    RolesModule,
    JwtModule.register({ signOptions: { expiresIn: '10d' } }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
