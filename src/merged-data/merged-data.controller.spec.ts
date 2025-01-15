import { Test, TestingModule } from '@nestjs/testing';
import { MergedDataController } from './merged-data.controller';
import { MergedDataService } from './merged-data.service';

describe('MergedDataController', () => {
  let controller: MergedDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MergedDataController],
      providers: [MergedDataService],
    }).compile();

    controller = module.get<MergedDataController>(MergedDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
