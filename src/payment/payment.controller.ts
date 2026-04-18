import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/interfaces/auth-user.interface';

@Controller('payments')
@UseGuards(JwtAuthGuard) // 🔐 protect all routes
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /* =======================
     INITIALIZE PAYMENT
  ======================= */
  @Post('initialize')
  initialize(@CurrentUser() user: AuthUser, @Body('amount') amount: number) {
    // 🔥 use logged-in user email instead of trusting client
    return this.paymentService.initializePayment(user.email, amount);
  }

  /* =======================
     VERIFY PAYMENT
  ======================= */
  @Post('verify')
  verify(@Body('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }
}
