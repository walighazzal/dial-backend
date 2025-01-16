import { Test, TestingModule } from '@nestjs/testing';
import { RefDataController } from './ref-data.controller';
import { RefDataService } from './ref-data.service';

describe('RefDataController', () => {
  let controller: RefDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefDataController],
      providers: [RefDataService],
    }).compile();

    controller = module.get<RefDataController>(RefDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
