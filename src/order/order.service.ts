import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from 'src/products/schema/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schema/schema';
// import { Order, OrderDocument } from './schema/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  /* =======================
     CREATE ORDER
  ======================= */
  async create(userId: string, dto: CreateOrderDto) {
    let totalPrice = 0;

    const items: {
      product: Types.ObjectId;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[] = [];

    for (const item of dto.items) {
      const product = await this.productModel.findById(item.productId);

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const price = product.price;

      totalPrice += price * item.quantity;

      items.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: price,
        subtotal: price * item.quantity,
      });
    }

    const order = await this.orderModel.create({
      user: new Types.ObjectId(userId),
      items,
      totalPrice,
    });

    return order;
  }

  /* =======================
     GET MY ORDERS
  ======================= */
  async findMyOrders(userId: string) {
    return this.orderModel
      .find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  /* =======================
     GET SINGLE ORDER
  ======================= */
  async findById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('items.product')
      .lean()
      .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
