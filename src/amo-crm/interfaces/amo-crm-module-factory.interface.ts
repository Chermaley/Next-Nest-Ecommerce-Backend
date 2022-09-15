import { ModuleMetadata } from '@nestjs/common';
import { AmoCrmModuleOptions } from '../types/amo-crm-module-options';

export interface AmoCrmModuleFactoryInterface
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<AmoCrmModuleOptions>;
}
