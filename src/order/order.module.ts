import { Module } from '@nestjs/common';
// import { OrdersService } from './orders.service';
// import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import { Order, OrderSchema } from './schema/order.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { Order, OrderSchema } from './schema/schema';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    PaymentModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
