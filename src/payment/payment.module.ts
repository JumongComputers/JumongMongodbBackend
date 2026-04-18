import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentService],
  exports: [PaymentService], // ✅ MUST BE HERE
})
export class PaymentModule {}
