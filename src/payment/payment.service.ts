import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  PaystackInitializeResponse,
  PaystackVerifyResponse,
} from './response interface/interface';

@Injectable()
export class PaymentService {
  private readonly baseUrl = process.env.PAYSTACK_BASE_URL;
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

  /* =======================
     INITIALIZE PAYMENT
  ======================= */
  async initializePayment(
    email: string,
    amount: number,
  ): Promise<PaystackInitializeResponse['data']> {
    const response = await axios.post<PaystackInitializeResponse>(
      `${this.baseUrl}/transaction/initialize`,
      {
        email,
        amount: amount * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }

  /* =======================
     VERIFY PAYMENT
  ======================= */
  async verifyPayment(
    reference: string,
  ): Promise<PaystackVerifyResponse['data']> {
    const response = await axios.get<PaystackVerifyResponse>(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    return response.data.data;
  }
}
