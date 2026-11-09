import {
  Injectable,
  Logger,
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AstronomyService {
  private readonly logger = new Logger(AstronomyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getApod() {
    const apiKey = this.configService.get<string>('NASA_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException('NASA_API_KEY is missing from .env');
    }

    // ✅ New official APOD endpoint (per api.nasa.gov documentation)
    const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=${apiKey}`;

    try {
      const { data } = await firstValueFrom(this.httpService.get(url));

      // The WP endpoint may return an array or a single object
      const item = Array.isArray(data) ? data[0] : data;

      return this.normalize(item);
    } catch (error: any) {
      const status = error?.response?.status;
      const detail = error?.response?.data;
      this.logger.error(
        `NASA API failed → status: ${status}, detail: ${JSON.stringify(detail)}`,
      );
      throw new BadGatewayException(`NASA API request failed (status ${status})`);
    }
  }

  /** Maps NASA's raw fields to our application shape */
  private normalize(raw: any) {
    return {
      title: raw.title,
      date: raw.date,
      explanation: raw.explanation,
      imageUrl: raw.hdurl || raw.url,
      mediaType: raw.media_type,
      credit: raw.credit || raw.copyright,
      permalink: raw.permalink,
    };
  }
}