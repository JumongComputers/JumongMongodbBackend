import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop()
  password?: string;

  @Prop()
  googleId?: string;

  @Prop()
  facebookId?: string;

  @Prop({ default: 'user' })
  role!: 'user' | 'admin';

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: null })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
