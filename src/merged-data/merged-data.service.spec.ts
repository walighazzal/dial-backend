import { Test, TestingModule } from '@nestjs/testing';
import { MergedDataService } from './merged-data.service';

describe('MergedDataService', () => {
  let service: MergedDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MergedDataService],
    }).compile();

    service = module.get<MergedDataService>(MergedDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
