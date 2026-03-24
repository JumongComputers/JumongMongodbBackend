import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      subtotal: { type: Number, required: true },
    },
  ])
  items!: {
    product: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];

  @Prop({ default: 0 })
  totalPrice!: number;

  @Prop({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
