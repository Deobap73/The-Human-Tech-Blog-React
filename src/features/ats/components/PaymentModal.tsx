// File: /src/features/ats/components/PaymentModal.tsx
// Description: PayPal Checkout modal. Creates and captures order via backend to avoid price tampering.
// Requires: VITE_PAYPAL_CLIENT_ID and backend /api/payment endpoints.

import React, { useCallback, useEffect, useRef } from 'react';
import '../styles/PaymentModal.scss';
import { createOrder, captureOrder } from '../../../shared/services/paymentService';

interface PaymentModalProps {
  priceEUR: number;
  onClose: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ priceEUR, onClose, onSuccess }) => {
  const btnRef = useRef<HTMLDivElement | null>(null);

  const loadSdk = useCallback(async () => {
    try {
      if (window.paypal) return true;
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        clientId
      )}&currency=EUR&intent=capture`;
      script.async = true;
      document.body.appendChild(script);
      await new Promise((res, rej) => {
        script.onload = () => res(true);
        script.onerror = () => rej(new Error('PayPal SDK failed to load'));
      });
      return true;
    } catch (err) {
      console.error('PayPal SDK load error:', err);
      alert('Could not load PayPal. Please retry.');
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const ok = await loadSdk();
      if (!ok || !mounted) return;

      if (!btnRef.current || !window.paypal) return;

      window.paypal
        .Buttons({
          style: { layout: 'vertical' },
          createOrder: async () => {
            try {
              // Call backend to create order (server validates amount/currency)
              const res = await createOrder({ amount: priceEUR, currency: 'EUR' });
              if (!res?.success || !res.data?.orderId) {
                throw new Error(res?.message ?? 'Could not create order');
              }
              return res.data.orderId;
            } catch (err) {
              console.error('createOrder error:', err);
              alert('Payment could not be initialized. Please try again.');
              return '';
            }
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              // Call backend to capture (server validates + persists)
              const res = await captureOrder({ orderId: data.orderID });
              if (!res?.success) throw new Error(res?.message ?? 'Capture failed');
              onSuccess();
            } catch (err) {
              console.error('captureOrder error:', err);
              alert('Payment capture failed. No charge has been made.');
            }
            return;
          },
          onCancel: () => {
            // Optional UX message
            return;
          },
          onError: (err: any) => {
            console.error('PayPal onError:', err);
            alert('A payment error occurred. Please try again.');
          },
        })
        .render(btnRef.current);
    })();

    return () => {
      mounted = false;
    };
  }, [loadSdk, onSuccess, priceEUR]);

  return (
    <div className='payment-modal' role='dialog' aria-modal='true'>
      <div className='payment-modal__content'>
        <div className='payment-modal__header'>
          <h3 className='payment-modal__title'>Pay €{priceEUR.toFixed(2)}</h3>
          <button className='payment-modal__close' onClick={onClose} aria-label='Close modal'>
            ×
          </button>
        </div>
        <div className='payment-modal__body'>
          <p className='payment-modal__text'>Complete the payment to unlock the generator.</p>
          <div className='payment-modal__paypal' ref={btnRef} />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
