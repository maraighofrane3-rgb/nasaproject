import { Controller, Get } from '@nestjs/common';
import { AstronomyService } from './astronomy.service';

@Controller('astronomy')
export class AstronomyController {
  constructor(private readonly astronomyService: AstronomyService) {}

  @Get('apod')
  getApod() {
    return this.astronomyService.getApod();
  }
}