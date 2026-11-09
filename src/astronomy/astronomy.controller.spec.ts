import { Test, TestingModule } from '@nestjs/testing';
import { AstronomyController } from './astronomy.controller';

describe('AstronomyController', () => {
  let controller: AstronomyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AstronomyController],
    }).compile();

    controller = module.get<AstronomyController>(AstronomyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
