import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  PaystackInitializeResponse,
  PaystackVerifyResponse,
} from './response interface/interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('PAYSTACK_BASE_URL')!;
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY')!;

    // Debug (remove later)
    console.log('BASE URL:', this.baseUrl);
    console.log('SECRET KEY:', this.secretKey);
  }

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
          'Content-Type': 'application/json',
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
