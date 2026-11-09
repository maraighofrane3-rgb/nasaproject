import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteDto } from './create-favorite.dto';

// All rules of CreateFavoriteDto, but every field becomes optional
export class UpdateFavoriteDto extends PartialType(CreateFavoriteDto) {}