import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export enum DiscoveryType {
  APOD = 'APOD',
  MARS = 'MARS',
  ASTEROID = 'ASTEROID',
}

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsEnum(DiscoveryType)
  discoveryType: DiscoveryType;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  // 🧹 Strips HTML tags coming from NASA's explanation field
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : value,
  )
  explanation?: string;
}