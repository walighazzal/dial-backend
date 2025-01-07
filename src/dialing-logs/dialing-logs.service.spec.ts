import { Test, TestingModule } from '@nestjs/testing';
import { DialingLogsService } from './dialing-logs.service';

describe('DialingLogsService', () => {
  let service: DialingLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DialingLogsService],
    }).compile();

    service = module.get<DialingLogsService>(DialingLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
