// File: /src/shared/services/paymentService.ts
// Description: PayPal order creation and capture via backend for anti-tampering.

import { ApiResponse } from '../../types/Ats';
import axios from '../utils/axios';

interface CreateOrderInput {
  amount: number; // EUR
  currency: 'EUR';
}

interface CreateOrderOutput {
  orderId: string;
}

interface CaptureOrderInput {
  orderId: string;
}

export const createOrder = async (
  payload: CreateOrderInput
): Promise<ApiResponse<CreateOrderOutput>> => {
  try {
    const { data } = await axios.post<ApiResponse<CreateOrderOutput>>(
      '/api/payment/paypal/create-order',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return data ?? { success: false, message: 'Empty response from server' };
  } catch (err: any) {
    console.error('createOrder error:', err);
    return { success: false, message: err?.response?.data?.message ?? 'Order creation failed' };
  }
};

export const captureOrder = async (payload: CaptureOrderInput): Promise<ApiResponse<{}>> => {
  try {
    const { data } = await axios.post<ApiResponse<{}>>('/api/payment/paypal/capture', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data ?? { success: false, message: 'Empty response from server' };
  } catch (err: any) {
    console.error('captureOrder error:', err);
    return { success: false, message: err?.response?.data?.message ?? 'Capture failed' };
  }
};
