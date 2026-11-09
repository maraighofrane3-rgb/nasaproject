import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Favorite, FavoriteDocument } from './favorite.schema.js';
import { CreateFavoriteDto } from './dto/create-favorite.dto.js';
import { UpdateFavoriteDto } from './dto/update-favorite.dto.js';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
  ) {}

  /** Guards against invalid ObjectId strings (prevents 500 crashes) */
  private assertValidId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`"${id}" is not a valid MongoDB id`);
    }
  }

  // ✅ 1. Accept userId and attach it to the new document
  async create(userId: string, dto: CreateFavoriteDto) {
    return this.favoriteModel.create({ ...dto, userId });
  }

  // ✅ 2. Only return documents belonging to this user
  async findAll(userId: string) {
    return this.favoriteModel.find({ userId }).exec();
  }

  // ✅ 3. Find by BOTH id AND userId (prevents User A from reading User B's data)
  async findOne(userId: string, id: string) {
    this.assertValidId(id);
    const doc = await this.favoriteModel.findOne({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException(`Favorite ${id} not found`);
    return doc;
  }

  // ✅ 4. Update only if the document belongs to this user
  async update(userId: string, id: string, dto: UpdateFavoriteDto) {
    this.assertValidId(id);
    const doc = await this.favoriteModel
      .findOneAndUpdate({ _id: id, userId }, dto, { new: true, runValidators: true })
      .exec();
    if (!doc) throw new NotFoundException(`Favorite ${id} not found`);
    return doc;
  }

  // ✅ 5. Delete only if the document belongs to this user
  async delete(userId: string, id: string) {
    this.assertValidId(id);
    const doc = await this.favoriteModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException(`Favorite ${id} not found`);
    return { message: `Favorite ${id} deleted` };
  }
}