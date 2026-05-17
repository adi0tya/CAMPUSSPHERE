import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async ({ amount, purpose, referenceId, onSuccess }) => {
    try {
      setIsProcessing(true);
      
      // Create order
      const { data } = await API.post('/api/payments/order', {
        amount,
        purpose,
        referenceId
      });

      const options = {
        key: data.key || 'rzp_test_mock',
        amount: data.order.amount,
        currency: 'INR',
        name: 'CampusSphere ERP',
        description: purpose,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await API.post('/api/payments/verify', {
              ...response,
              paymentId: data.payment._id
            });
            toast.success('Payment Successful!');
            if (onSuccess) onSuccess();
          } catch (err) {
            toast.error('Payment Verification Failed');
          }
        },
        prefill: {
          name: 'CampusSphere User',
          email: 'user@campussphere.com'
        },
        theme: { color: '#0ea5e9' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        toast.error('Payment cancelled or failed');
      });
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return { initiatePayment, isProcessing };
};
