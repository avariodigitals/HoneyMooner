const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL ?? 'https://cms.thehoneymoonertravel.com/wp-json';
const PAYMENTS_ENABLED = (
  import.meta.env.VITE_WP_PAYMENTS_ENABLED ?? (import.meta.env.DEV ? 'false' : 'true')
) === 'true';
const PAYMENTS_NAMESPACE = import.meta.env.VITE_WP_PAYMENTS_NAMESPACE ?? '/custom/v1/payments';

const PAYMENTS_BASE_URL = `${WP_BASE_URL}${PAYMENTS_NAMESPACE}`;
const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]{1,100}$/;
const SAFE_REFERENCE_PATTERN = /^[a-zA-Z0-9._:-]{6,200}$/;
const SAFE_EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

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

export interface PaystackQuoteResponse {
  success: boolean;
  package_id: string;
  tier_id: string;
  tier_name: string;
  base_amount: number;
  amount: number;
  currency: string;
  deposit_type: 'fixed' | 'percentage';
}

export interface InitializePaystackInput {
  packageId: string;
  tierId: string;
  email: string;
  description: string;
  customId: string;
  callbackUrl?: string;
}

export interface InitializePaystackResponse {
  success: boolean;
  reference: string;
  amount: number;
  currency: string;
  public_key?: string;
  access_code?: string;
  authorization_url?: string;
}

export interface VerifyPaystackResponse {
  success: boolean;
  reference: string;
  status: string;
  amount: number;
  currency: string;
  customer_email?: string;
  customer_name?: string;
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

function assertSafeId(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!SAFE_ID_PATTERN.test(normalized)) {
    throw new Error(`Invalid ${fieldName} value.`);
  }
  return normalized;
}

function sanitizeText(value: string, maxLength: number): string {
  const withoutControls = Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join('');

  return withoutControls
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

function assertSafeEmail(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!SAFE_EMAIL_PATTERN.test(normalized) || normalized.length > 120) {
    throw new Error('Invalid email address.');
  }
  return normalized;
}

function assertSafeReference(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!SAFE_REFERENCE_PATTERN.test(normalized)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
  return normalized;
}

function assertSameOriginHttpUrl(value: string | undefined, fieldName: string): string | undefined {
  if (!value) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid ${fieldName} URL.`);
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`Invalid ${fieldName} protocol.`);
  }

  if (typeof window !== 'undefined' && parsed.origin !== window.location.origin) {
    throw new Error(`${fieldName} must match app origin.`);
  }

  return parsed.toString();
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
      package_id: assertSafeId(packageId, 'package_id'),
      tier_id: assertSafeId(tierId, 'tier_id')
    });

    const response = await fetch(`${PAYMENTS_BASE_URL}/paypal/quote?${params.toString()}`);
    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as PayPalQuoteResponse;
  },

  async getPaystackQuote(packageId: string, tierId: string): Promise<PaystackQuoteResponse> {
    if (!PAYMENTS_ENABLED) {
      throw new Error('Payments are currently disabled.');
    }

    const params = new URLSearchParams({
      package_id: assertSafeId(packageId, 'package_id'),
      tier_id: assertSafeId(tierId, 'tier_id')
    });

    const response = await fetch(`${PAYMENTS_BASE_URL}/paystack/quote?${params.toString()}`);
    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as PaystackQuoteResponse;
  },

  async initializePaystackTransaction(input: InitializePaystackInput): Promise<InitializePaystackResponse> {
    if (!PAYMENTS_ENABLED) {
      throw new Error('Payments are currently disabled.');
    }

    const response = await fetch(`${PAYMENTS_BASE_URL}/paystack/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        package_id: assertSafeId(input.packageId, 'package_id'),
        tier_id: assertSafeId(input.tierId, 'tier_id'),
        email: assertSafeEmail(input.email),
        description: sanitizeText(input.description, 180),
        custom_id: sanitizeText(input.customId, 120),
        callback_url: assertSameOriginHttpUrl(input.callbackUrl, 'callback_url')
      })
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as InitializePaystackResponse;
  },

  async verifyPaystackTransaction(reference: string): Promise<VerifyPaystackResponse> {
    if (!PAYMENTS_ENABLED) {
      throw new Error('Payments are currently disabled.');
    }

    const response = await fetch(`${PAYMENTS_BASE_URL}/paystack/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: assertSafeReference(reference, 'payment reference') })
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as VerifyPaystackResponse;
  },

  async createPayPalOrder(input: CreatePayPalOrderInput): Promise<CreatePayPalOrderResponse> {
    if (!PAYMENTS_ENABLED) {
      throw new Error('Payments are currently disabled.');
    }

    const response = await fetch(`${PAYMENTS_BASE_URL}/paypal/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        package_id: assertSafeId(input.packageId, 'package_id'),
        tier_id: assertSafeId(input.tierId, 'tier_id'),
        description: sanitizeText(input.description, 180),
        custom_id: sanitizeText(input.customId, 120),
        return_url: assertSameOriginHttpUrl(input.returnUrl, 'return_url'),
        cancel_url: assertSameOriginHttpUrl(input.cancelUrl, 'cancel_url')
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
      body: JSON.stringify({ order_id: assertSafeReference(orderId, 'PayPal order id') })
    });

    if (!response.ok) {
      throw await parseError(response);
    }

    return await response.json() as CapturePayPalOrderResponse;
  }
};
