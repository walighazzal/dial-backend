import { Test, TestingModule } from '@nestjs/testing';
import { DncService } from './dnc.service';

describe('DncService', () => {
  let service: DncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DncService],
    }).compile();

    service = module.get<DncService>(DncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
