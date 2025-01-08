import { Test, TestingModule } from '@nestjs/testing';
import { DialingLogsService } from './dialing-logs.service';
import { DialingLogsController } from './dialing-logs.controller';

describe('DialingLogsController', () => {
  let controller: DialingLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DialingLogsController],
      providers: [DialingLogsService],
    }).compile();

    controller = module.get<DialingLogsController>(DialingLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
