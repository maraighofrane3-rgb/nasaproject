import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({
    required: true,
    enum: ['APOD', 'MARS', 'ASTEROID'],
  })
  discoveryType: string;

  @Prop()
  explanation: string;

  @Prop({ required: true, index: true })
  userId: string;
}


export const FavoriteSchema = SchemaFactory.createForClass(Favorite);