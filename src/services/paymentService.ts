const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL ?? 'https://cms.thehoneymoonertravel.com/wp-json';
const PAYMENTS_ENABLED = (import.meta.env.VITE_WP_PAYMENTS_ENABLED ?? 'true') === 'true';
const PAYMENTS_NAMESPACE = import.meta.env.VITE_WP_PAYMENTS_NAMESPACE ?? '/custom/v1/payments';

const PAYMENTS_BASE_URL = `${WP_BASE_URL}${PAYMENTS_NAMESPACE}`;

export interface CreatePayPalOrderInput {
  packageId: string;
  tierId: string;
  description: string;
  customId: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface CreatePayPalOrderResponse {
  success: boolean;
  order_id: string;
  status: string;
  approve_url: string;
  amount: number;
  currency: string;
}

export interface PayPalQuoteResponse {
  success: boolean;
  package_id: string;
  tier_id: string;
  tier_name: string;
  base_amount: number;
  amount: number;
  currency: string;
  deposit_type: 'fixed' | 'percentage';
}

export interface CapturePayPalOrderResponse {
  success: boolean;
  order_id: string;
  status: string;
  transaction_id: string;
  amount: number;
  currency: string;
  payer_email: string;
  payer_name: string;
}

interface ErrorResponse {
  message?: string;
}

async function parseError(response: Response): Promise<Error> {
  try {
    const data = await response.json() as ErrorResponse;
    const msg = typeof data?.message === 'string' && data.message.trim().length > 0
      ? data.message
      : `Payment request failed with status ${response.status}`;
    return new Error(msg);
  } catch {
    return new Error(`Payment request failed with status ${response.status}`);
  }
}

export const paymentService = {
  isEnabled(): boolean {
    return PAYMENTS_ENABLED;
  },

  async getPayPalQuote(packageId: string, tierId: string): Promise<PayPalQuoteResponse> {
    if (!PAYMENTS_ENABLED) {
      throw new Error('Payments are currently disabled.');
    }

    const params = new URLSearchParams({
      package_id: packageId,
      tier_id: tierId
    });

    const response = await fetch(`${PAYMENTS_BASE_URL}/paypal/quote?${params.toString()}`);
    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as PayPalQuoteResponse;
  },

  async createPayPalOrder(input: CreatePayPalOrderInput): Promise<CreatePayPalOrderResponse> {
    if (!PAYMENTS_ENABLED) {
      throw new Error('Payments are currently disabled.');
    }

    const response = await fetch(`${PAYMENTS_BASE_URL}/paypal/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        package_id: input.packageId,
        tier_id: input.tierId,
        description: input.description,
        custom_id: input.customId,
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl
      })
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as CreatePayPalOrderResponse;
  },

  async capturePayPalOrder(orderId: string): Promise<CapturePayPalOrderResponse> {
    if (!PAYMENTS_ENABLED) {
      throw new Error('Payments are currently disabled.');
    }

    const response = await fetch(`${PAYMENTS_BASE_URL}/paypal/capture-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as CapturePayPalOrderResponse;
  }
};
