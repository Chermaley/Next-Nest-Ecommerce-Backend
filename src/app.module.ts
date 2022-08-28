import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { User } from './users/users.model';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { Product } from './products/products.model';
import { ProductType } from './product-types/product-types.model';
import { AdminModule } from '@adminjs/nestjs';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import AdminJS from 'adminjs';

import { Database, Resource } from '@adminjs/sequelize';
import { AuthService } from './auth/auth.service';
import { FilesService } from './files/files.service';
import { configureAdmin } from './admin';
import { BasketModule } from './basket/basket.module';
import { Basket } from './basket/basket.model';
import { BasketProduct } from './basket/basket-product.model';
import { ProductComentsModule } from './product-coments/product-coments.module';
import { ProductComment } from './product-coments/product-comments.model';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { Consultation } from './chat/models/consultation.model';
import { ActiveConsultation } from './chat/models/active-consultation.model';
import { Message } from './chat/models/message.model';

AdminJS.registerAdapter({ Resource, Database });

@Module({
  controllers: [],
  providers: [ChatService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD.toString(),
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles,
        Product,
        ProductType,
        Basket,
        BasketProduct,
        ProductComment,
        Consultation,
        ActiveConsultation,
        Message,
      ],
      autoLoadModels: true,
      // sync: { force: true },
    }),
    AdminModule.createAdminAsync({
      imports: [AuthModule, FilesModule],
      inject: [AuthService, FilesService],
      useFactory: configureAdmin,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProductsModule,
    ProductTypesModule,
    FilesModule,
    BasketModule,
    ProductComentsModule,
    ChatModule,
  ],
})
export class AppModule {}
