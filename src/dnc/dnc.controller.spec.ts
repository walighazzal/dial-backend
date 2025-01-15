import { Test, TestingModule } from '@nestjs/testing';
import { DncController } from './dnc.controller';
import { DncService } from './dnc.service';

describe('DncController', () => {
  let controller: DncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DncController],
      providers: [DncService],
    }).compile();

    controller = module.get<DncController>(DncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
