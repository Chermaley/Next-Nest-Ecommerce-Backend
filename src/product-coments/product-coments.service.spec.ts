import { Test, TestingModule } from '@nestjs/testing';
import { ProductComentsService } from './product-coments.service';

describe('ProductComentsService', () => {
  let service: ProductComentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductComentsService],
    }).compile();

    service = module.get<ProductComentsService>(ProductComentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
