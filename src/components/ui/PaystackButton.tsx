import React, { useEffect, useMemo, useState } from 'react';
import { Landmark, Loader2 } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import { paymentService } from '../../services/paymentService';
import SuccessModal from './SuccessModal';

interface PaystackPaymentDetails {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
  };
}

interface PaystackButtonProps {
  packageId: string;
  tierId: string;
  onSuccess?: (details: PaystackPaymentDetails) => void;
  disabled?: boolean;
  description?: string;
  customId?: string;
}

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  callback?: (response: { reference: string }) => void;
  onClose?: () => void;
};

type PaystackHandler = {
  openIframe: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => PaystackHandler;
    };
  }
}

let paystackScriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (window.PaystackPop) {
    return Promise.resolve();
  }

  if (paystackScriptPromise) {
    return paystackScriptPromise;
  }

  paystackScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-paystack-inline="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Unable to load Paystack checkout script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.defer = true;
    script.dataset.paystackInline = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Paystack checkout script.'));
    document.body.appendChild(script);
  });

  return paystackScriptPromise;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  packageId,
  tierId,
  onSuccess,
  disabled,
  description,
  customId
}) => {
  const [email] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [quoteAmount, setQuoteAmount] = useState<number | null>(null);
  const [quoteCurrency, setQuoteCurrency] = useState<string>('NGN');
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaystackPaymentDetails | null>(null);
  const { currency, formatPrice } = useCurrency();

  useEffect(() => {
    let ignore = false;

    const loadQuote = async () => {
      if (!packageId || !tierId) {
        if (!ignore) {
          setQuoteAmount(null);
          setIsQuoteLoading(false);
          setErrorMessage('Please select a valid package and tier to continue.');
        }
        return;
      }

      if (!paymentService.isEnabled()) {
        if (!ignore) {
          setQuoteAmount(null);
          setIsQuoteLoading(false);
          setErrorMessage('Paystack payments are unavailable in this environment.');
        }
        return;
      }

      setIsQuoteLoading(true);
      setErrorMessage('');

      try {
        const quote = await paymentService.getPaystackQuote(packageId, tierId);
        if (ignore) return;
        setQuoteAmount(quote.amount);
        setQuoteCurrency(quote.currency);
      } catch (error) {
        if (ignore) return;
        let message = 'Unable to load payment amount.';
        if (error instanceof Error) {
          if (error.message.includes('Not Found')) {
            message = 'This package or tier is not available for payment. Please contact support or choose another.';
          } else if (error.message.includes('Invalid')) {
            message = 'Invalid package or tier selected. Please try again.';
          } else {
            message = error.message;
          }
        }
        setErrorMessage(message);
        setQuoteAmount(null);
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

  const isEmailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);

  const handlePayment = async () => {
    if (!paymentService.isEnabled()) {
      setErrorMessage('Payments are currently disabled by configuration.');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Enter a valid email address to continue with Paystack.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const callbackUrl = `${window.location.origin}${window.location.pathname}`;
      const initialized = await paymentService.initializePaystackTransaction({
        packageId,
        tierId,
        email: email.trim(),
        description: description || 'The Honeymoonner Travel Package Payment',
        customId: customId || `payment-${Date.now()}`,
        callbackUrl
      });

      await loadPaystackScript();

      const paystackPublicKey = initialized.public_key || (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined);
      if (!paystackPublicKey) {
        throw new Error('Paystack public key was not provided by the backend.');
      }

      const amountInKobo = Math.round((initialized.amount || quoteAmount || 0) * 100);
      if (amountInKobo <= 0) {
        throw new Error('Unable to initialize payment amount.');
      }

      const paystack = window.PaystackPop;
      if (!paystack) {
        throw new Error('Paystack checkout is not available right now.');
      }

      const handler = paystack.setup({
        key: paystackPublicKey,
        email: email.trim(),
        amount: amountInKobo,
        currency: initialized.currency || quoteCurrency,
        ref: initialized.reference,
        callback: async (response) => {
          try {
            const verification = await paymentService.verifyPaystackTransaction(response.reference);
            const details: PaystackPaymentDetails = {
              reference: verification.reference,
              status: verification.status,
              amount: verification.amount,
              currency: verification.currency || quoteCurrency,
              customer: {
                email: verification.customer_email || email.trim(),
                name: verification.customer_name || 'Paystack Customer'
              }
            };

            setPaymentDetails(details);
            setShowSuccess(true);
            onSuccess?.(details);
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to verify your Paystack payment.';
            setErrorMessage(message);
          } finally {
            setIsProcessing(false);
          }
        },
        onClose: () => {
          setIsProcessing(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to initialize Paystack checkout.';
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  const isUnavailable = disabled || isProcessing || isQuoteLoading || quoteAmount === null || !!errorMessage;
  const hasCurrencyConversion = quoteAmount !== null && quoteCurrency !== currency.code;
  const selectedCurrencyAmount = quoteAmount !== null ? formatPrice(quoteAmount, quoteCurrency) : null;
  const chargeAmount = quoteAmount !== null ? `${quoteCurrency} ${quoteAmount.toFixed(2)}` : null;

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={handlePayment}
          disabled={isUnavailable}
          className={`w-full h-12 sm:h-13 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${
            isUnavailable
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#0BA4DB] hover:bg-[#0785B2] text-white'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <Landmark size={18} />
              <span>Pay with Paystack</span>
              {selectedCurrencyAmount && (
                <span className="text-[11px] sm:text-xs font-medium text-white/90">
                  {selectedCurrencyAmount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <p className="mt-3 text-center text-xs text-red-600">
          {errorMessage}
        </p>
      )}

      {quoteAmount !== null && !errorMessage && (
        <div className="mt-3 space-y-1 text-center">
          <p className="text-[11px] text-brand-500">
            Amount due now.
            {hasCurrencyConversion && chargeAmount ? ` Charged as ${chargeAmount}.` : ''}
          </p>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Payment Successful!"
        message="Your full payment has been confirmed. Our team will reach out shortly with your next travel steps."
        transactionId={paymentDetails?.reference}
        amount={paymentDetails ? `${paymentDetails.currency} ${paymentDetails.amount.toFixed(2)}` : undefined}
        actionLabel="Begin Forever Together"
      />
    </>
  );
};

export default PaystackButton;
