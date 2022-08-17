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
import uploadFeature from '@adminjs/upload';

import { Resource, Database } from '@adminjs/sequelize';
import AdminJS from 'adminjs';
import * as path from 'path';
import * as fs from 'fs';
import { AuthService } from './auth/auth.service';

AdminJS.registerAdapter({ Resource, Database });

if (!fs.existsSync(path.resolve(__dirname, '..', 'static'))) {
  fs.mkdirSync(path.resolve(__dirname, '..', 'static'), { recursive: true });
}

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD.toString(),
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Product, ProductType],
      autoLoadModels: true,
      sync: {},
    }),
    AdminModule.createAdminAsync({
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (authService: AuthService) => {
        return {
          auth: {
            authenticate: async (email, password) =>
              authService.loginAdmin({ email, password }),
            cookieName: 'test',
            cookiePassword: 'testPass',
          },
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Product,
                options: {
                  properties: {
                    image: {
                      isVisible: false,
                    },
                  },
                },
                features: [
                  uploadFeature({
                    provider: {
                      local: { bucket: path.join(__dirname, 'static') },
                    },
                    properties: {
                      key: 'image',
                    },
                  }),
                ],
              },
              { resource: ProductType, options: {} },
            ],
            locale: {
              language: 'ru',
              translations: {
                labels: {
                  products: 'Продукты',
                  'product-types': 'Линейки',
                  navigation: 'Навигация',
                  dashboard: 'Панель управления',
                },
                buttons: {
                  filter: 'Фильтр',
                },
                actions: {
                  new: 'Создать',
                  edit: 'Изменить',
                  show: 'Показать',
                  delete: 'Удалить',
                  search: 'Поиск',
                  bulkDelete: 'Удалить выбранное',
                },
              },
            },
          },
        };
      },
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProductsModule,
    ProductTypesModule,
    FilesModule,
  ],
})
export class AppModule {}
