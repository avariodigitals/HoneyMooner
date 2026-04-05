import React, { useEffect, useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { paymentService } from '../../services/paymentService';
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
  packageId: string;
  tierId: string;
  onSuccess?: (details: PayPalPaymentDetails) => void;
  disabled?: boolean;
  description?: string;
  customId?: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ packageId, tierId, onSuccess, disabled, description, customId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quoteAmount, setQuoteAmount] = useState<number | null>(null);
  const [quoteCurrency, setQuoteCurrency] = useState<string>('USD');
  const [quoteBaseAmount, setQuoteBaseAmount] = useState<number | null>(null);
  const [quoteDepositType, setQuoteDepositType] = useState<'fixed' | 'percentage'>('fixed');
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PayPalPaymentDetails | null>(null);
  const { currency, formatPrice } = useCurrency();

  useEffect(() => {
    let ignore = false;

    const loadQuote = async () => {
      if (!packageId || !tierId) {
        if (!ignore) {
          setQuoteAmount(null);
          setIsQuoteLoading(false);
          setErrorMessage('Select a package and tier to continue with PayPal.');
        }
        return;
      }

      if (!paymentService.isEnabled()) {
        if (!ignore) {
          setQuoteAmount(null);
          setQuoteBaseAmount(null);
          setIsQuoteLoading(false);
          setErrorMessage('PayPal payments are unavailable in this environment.');
        }
        return;
      }

      setIsQuoteLoading(true);
      setErrorMessage('');

      try {
        const quote = await paymentService.getPayPalQuote(packageId, tierId);
        if (ignore) return;
        setQuoteAmount(quote.amount);
        setQuoteCurrency(quote.currency);
        setQuoteBaseAmount(quote.base_amount);
        setQuoteDepositType(quote.deposit_type);
      } catch (error) {
        if (ignore) return;
        const message = error instanceof Error ? error.message : 'Unable to load payment amount.';
        setErrorMessage(message);
        setQuoteAmount(null);
        setQuoteBaseAmount(null);
      } finally {
        if (!ignore) {
          setIsQuoteLoading(false);
        }
      }
    };

    void loadQuote();

    return () => {
      ignore = true;
    };
  }, [packageId, tierId]);

  useEffect(() => {
    const handleReturnFromPayPal = async () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('hmPayPal');
      const token = params.get('token');

      if (status !== 'success' || !token) return;

      setIsProcessing(true);
      setErrorMessage('');

      try {
        const capture = await paymentService.capturePayPalOrder(token);
        const details: PayPalPaymentDetails = {
          id: capture.transaction_id || capture.order_id,
          status: capture.status,
          amount: capture.amount,
          currency: capture.currency || currency.code,
          payer: {
            email: capture.payer_email || 'unknown@payer.com',
            name: capture.payer_name || 'PayPal Customer'
          }
        };

        setPaymentDetails(details);
        setShowSuccess(true);
        onSuccess?.(details);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to confirm your PayPal payment.';
        setErrorMessage(message);
      } finally {
        setIsProcessing(false);
        params.delete('hmPayPal');
        params.delete('token');
        params.delete('PayerID');
        params.delete('ba_token');
        const nextSearch = params.toString();
        const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
        window.history.replaceState({}, '', nextUrl);
      }
    };

    void handleReturnFromPayPal();
  }, [currency.code, onSuccess]);

  const handlePayment = async () => {
    if (!paymentService.isEnabled()) {
      setErrorMessage('Payments are currently disabled by configuration.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const currentUrl = new URL(window.location.href);
      const returnUrl = new URL(currentUrl.toString());
      returnUrl.searchParams.set('hmPayPal', 'success');
      const cancelUrl = new URL(currentUrl.toString());
      cancelUrl.searchParams.set('hmPayPal', 'cancelled');

      const order = await paymentService.createPayPalOrder({
        packageId,
        tierId,
        description: description || 'The Honeymoonner Deposit',
        customId: customId || `deposit-${Date.now()}`,
        returnUrl: returnUrl.toString(),
        cancelUrl: cancelUrl.toString()
      });

      if (!order.approve_url) {
        throw new Error('Unable to start PayPal checkout right now.');
      }

      window.location.href = order.approve_url;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to initialize PayPal checkout.';
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  const isUnavailable = disabled || isProcessing || isQuoteLoading || quoteAmount === null;
  const percentageValue = quoteBaseAmount && quoteBaseAmount > 0
    ? Math.round((quoteAmount ?? 0) / quoteBaseAmount * 100)
    : null;
  const hasCurrencyConversion = quoteAmount !== null && quoteCurrency !== currency.code;
  const selectedCurrencyAmount = quoteAmount !== null ? formatPrice(quoteAmount, quoteCurrency) : null;
  const chargeAmount = quoteAmount !== null ? `${quoteCurrency} ${quoteAmount.toFixed(2)}` : null;

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isUnavailable}
        className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${
          isUnavailable
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
            {selectedCurrencyAmount && (
              <span className="text-xs font-semibold text-[#2C2E2F]">
                {selectedCurrencyAmount}
              </span>
            )}
          </>
        )}
      </button>

      {errorMessage && (
        <p className="mt-3 text-center text-xs text-red-600">
          {errorMessage}
        </p>
      )}

      {quoteAmount !== null && !errorMessage && (
        <div className="mt-3 space-y-1 text-center">
          <p className="text-[11px] text-brand-500">
            {quoteDepositType === 'percentage' && percentageValue !== null
              ? `${percentageValue}% deposit due now.`
              : 'Deposit due now.'}
            {hasCurrencyConversion && chargeAmount ? ` Charged as ${chargeAmount}.` : ''}
          </p>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Payment Successful!"
        message="Your deposit has been secured. Our team will contact you shortly to finalize your romantic escape."
        transactionId={paymentDetails?.id}
        amount={paymentDetails ? `${paymentDetails.currency} ${paymentDetails.amount.toFixed(2)}` : undefined}
        actionLabel="Celebrate This Love"
      />
    </>
  );
};

export default PayPalButton;
