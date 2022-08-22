import { AdminModuleOptions } from '@adminjs/nestjs';
import { Product } from '../products/products.model';
import AdminJS, { flat } from 'adminjs';
import { ProductType } from '../product-types/product-types.model';
import { UserRoles } from '../roles/user-roles.model';
import { User } from '../users/users.model';
import { Role } from '../roles/roles.model';
import { AuthService } from '../auth/auth.service';
import { FilesService } from '../files/files.service';
import { locale } from './locale';

export const configureAdmin = (
  authService: AuthService,
  filesService: FilesService,
): AdminModuleOptions => ({
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
              before: beforeSaveProduct(filesService),
            },
            edit: {
              before: beforeSaveProduct(filesService),
            },
          },
          properties: {
            image1: {
              components: {
                edit: uploadPhotoBundle,
              },
            },
            image2: {
              components: {
                edit: uploadPhotoBundle,
              },
            },
            image3: {
              components: {
                edit: uploadPhotoBundle,
              },
            },
          },
        },
      },
      { resource: ProductType, options: {} },
      { resource: UserRoles },
      { resource: User },
      { resource: Role },
    ],
    locale,
  },
});

const beforeSaveProduct =
  (filesService: FilesService) => async (response: any) => {
    const fields = flat.unflatten(response.payload);
    const images = {};

    for (const [key, param] of Object.entries<any>(fields)) {
      if (param && param.file) {
        images[key] = await filesService.createFile(param as { file: string });
      }
    }

    return {
      ...response,
      payload: { ...fields, ...images },
    };
  };

const uploadPhotoBundle = AdminJS.bundle('./components/UploadPhoto');
