import { Test, TestingModule } from '@nestjs/testing';
import { ProductTypesController } from './product-types.controller';

describe('ProductsTypesController', () => {
  let controller: ProductTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductTypesController],
    }).compile();

    controller = module.get<ProductTypesController>(ProductTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
