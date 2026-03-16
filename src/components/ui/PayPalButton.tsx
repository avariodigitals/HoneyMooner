import React, { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import SuccessModal from './SuccessModal';

interface PayPalPaymentDetails {
  id: string;
  status: string;
  amount: number;
  currency: string;
  payer: {
    email: string;
    name: string;
  };
}

interface PayPalButtonProps {
  amount: number;
  onSuccess?: (details: PayPalPaymentDetails) => void;
  disabled?: boolean;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, disabled }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PayPalPaymentDetails | null>(null);
  const { currency, formatPrice } = useCurrency();

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate PayPal Checkout process
    setTimeout(() => {
      const mockDetails: PayPalPaymentDetails = {
        id: 'PAYID-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'COMPLETED',
        amount: amount * currency.rate,
        currency: currency.code,
        payer: {
          email: 'customer@example.com',
          name: 'John Doe'
        }
      };
      
      setIsProcessing(false);
      setPaymentDetails(mockDetails);
      setShowSuccess(true);
      
      if (onSuccess) {
        onSuccess(mockDetails);
      }
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${
          disabled || isProcessing
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-[#FFC439] hover:bg-[#F2BA36] text-[#2C2E2F]'
        }`}
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-2 border-[#2C2E2F]/20 border-t-[#2C2E2F] rounded-full animate-spin" />
        ) : (
          <>
            <svg className="h-5" viewBox="0 0 100 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.7 2.3C11.9 1.5 10.7 1.1 9.2 1.1H2.4C1.9 1.1 1.5 1.5 1.4 2L0.1 10.5C0 10.8 0.2 11.1 0.5 11.1H3.6C4 11.1 4.3 10.8 4.4 10.4L5.1 6H7.9C11.1 6 13.3 4.5 13.9 1.6C13.9 1.4 13.9 1.2 13.9 1C13.6 1.6 13.2 2 12.7 2.3Z" fill="#27346A"/>
              <path d="M21.1 1.1H14.3C13.8 1.1 13.4 1.5 13.3 2L12 10.5C11.9 10.8 12.1 11.1 12.4 11.1H15.5C15.9 11.1 16.2 10.8 16.3 10.4L17 6H19.8C23 6 25.2 4.5 25.8 1.6C25.8 1.4 25.8 1.2 25.8 1C25.5 1.1 21.1 1.1 21.1 1.1Z" fill="#27346A"/>
              <path d="M32.1 1.1H25.3C24.8 1.1 24.4 1.5 24.3 2L23 10.5C22.9 10.8 23.1 11.1 23.4 11.1H26.5C26.9 11.1 27.2 10.8 27.3 10.4L28 6H30.8C34 6 36.2 4.5 36.8 1.6C36.8 1.4 36.8 1.2 36.8 1C36.5 1.1 32.1 1.1 32.1 1.1Z" fill="#27346A"/>
            </svg>
            <span className="italic">Pay with</span>
            <span className="font-extrabold italic text-[#003087]">PayPal</span>
          </>
        )}
      </button>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Payment Successful!"
        message="Your deposit has been secured. Our team will contact you shortly to finalize your romantic escape."
        transactionId={paymentDetails?.id}
        amount={formatPrice(amount)}
      />
    </>
  );
};

export default PayPalButton;
