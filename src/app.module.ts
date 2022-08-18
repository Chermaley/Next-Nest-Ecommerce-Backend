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
import AdminJS, { flat } from 'adminjs';

import { Database, Resource } from '@adminjs/sequelize';
import { AuthService } from './auth/auth.service';
import { FilesService } from './files/files.service';

AdminJS.registerAdapter({ Resource, Database });

@Module({
  controllers: [],
  providers: [],
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
      models: [User, Role, UserRoles, Product, ProductType],
      autoLoadModels: true,
      sync: {},
    }),
    AdminModule.createAdminAsync({
      imports: [AuthModule, FilesModule],
      inject: [AuthService, FilesService],
      useFactory: (authService: AuthService, filesService: FilesService) => {
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
                  actions: {
                    new: {
                      after: async (response) => {
                        const { record } = response;
                        const params = flat.unflatten(record.params);
                        const images = {};
                        if (
                          !Object.values(record.errors).every(
                            (val) => typeof val === 'undefined',
                          )
                        ) {
                          for (const [key, param] of Object.entries(params)) {
                            if (typeof param === 'object' && param !== null) {
                              images[key] = await filesService.createFile(
                                param as { file: string },
                              );
                            }
                          }
                        }
                        return {
                          ...response,
                          record: {
                            ...response.record,
                            params: flat.flatten({ ...params, ...images }),
                          },
                          notice: {
                            message: 'Продукт создан!',
                            type: 'success',
                          },
                        };
                      },
                    },
                  },
                  properties: {
                    image1: {
                      components: {
                        edit: AdminJS.bundle('../adminComponents/UploadPhoto'),
                      },
                    },
                    image2: {
                      components: {
                        edit: AdminJS.bundle('../adminComponents/UploadPhoto'),
                      },
                    },
                    image3: {
                      components: {
                        edit: AdminJS.bundle('../adminComponents/UploadPhoto'),
                      },
                    },
                  },
                },
                // options: {
                //   properties: {
                //     image: {
                //       component: AdminJS.bundle(
                //         '../adminComponents/UploadPhoto.tsx',
                //       ),
                //     },
                //   },
                // },

                // features: [
                //   uploadFeature({
                //     provider: {
                //       local: { bucket: path.join(__dirname, 'static') },
                //     },
                //     properties: {
                //       key: 'image',
                //     },
                //   }),
                // ],
              },
              { resource: ProductType, options: {} },
              { resource: UserRoles },
              { resource: User },
              { resource: Role },
            ],
            locale: {
              language: 'ru',
              translations: {
                labels: {
                  products: 'Продукты',
                  'product-types': 'Линейки',
                  navigation: 'Навигация',
                  dashboard: 'Панель управления',
                  user_roles: 'Пользователи - Роли',
                  users: 'Пользователи',
                  roles: 'Роли',
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
