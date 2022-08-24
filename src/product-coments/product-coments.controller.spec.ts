import { Test, TestingModule } from '@nestjs/testing';
import { ProductComentsController } from './product-coments.controller';

describe('ProductComentsController', () => {
  let controller: ProductComentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductComentsController],
    }).compile();

    controller = module.get<ProductComentsController>(ProductComentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
