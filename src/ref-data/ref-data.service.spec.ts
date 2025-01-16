import { Test, TestingModule } from '@nestjs/testing';
import { RefDataService } from './ref-data.service';

describe('RefDataService', () => {
  let service: RefDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefDataService],
    }).compile();

    service = module.get<RefDataService>(RefDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
