import { Test, TestingModule } from '@nestjs/testing';
import { AstronomyService } from './astronomy.service';

describe('AstronomyService', () => {
  let service: AstronomyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AstronomyService],
    }).compile();

    service = module.get<AstronomyService>(AstronomyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
