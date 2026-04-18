import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/ecommerce_db' as string),
    ConfigModule.forRoot({
      isGlobal: true, // ✅ important
    }),
    DatabaseModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    PaymentModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
