import type { PaymentIntent, PaymentStatus } from "@/types";
import { PaymentMethod } from "@/types";

// ─── Provider Interface ──────────────────────────────────────────────────────

export interface PaymentProvider {
  name: string;
  createPaymentIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<PaymentIntent>;
  confirmPayment(intentId: string): Promise<PaymentIntent>;
  refundPayment(intentId: string, amount?: number): Promise<boolean>;
  getPaymentStatus(intentId: string): Promise<PaymentStatus>;
}

// ─── Stripe Provider ─────────────────────────────────────────────────────────

export class StripeProvider implements PaymentProvider {
  name = "stripe";

  // In production, initialize the Stripe SDK here:
  // private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  async createPaymentIntent(
    amount: number,
    currency = "pkr",
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    // TODO: Replace with real Stripe API call:
    // const intent = await this.stripe.paymentIntents.create({ amount: amount * 100, currency, metadata })
    return {
      id: `pi_placeholder_${Date.now()}`,
      amount,
      currency,
      status: PaymentStatus.PENDING,
      provider: "stripe",
      metadata,
    };
  }

  async confirmPayment(intentId: string): Promise<PaymentIntent> {
    // TODO: await this.stripe.paymentIntents.confirm(intentId)
    return {
      id: intentId,
      amount: 0,
      currency: "pkr",
      status: PaymentStatus.PAID,
      provider: "stripe",
    };
  }

  async refundPayment(intentId: string, _amount?: number): Promise<boolean> {
    // TODO: await this.stripe.refunds.create({ payment_intent: intentId, amount })
    console.log(`Refunding payment intent: ${intentId}`);
    return true;
  }

  async getPaymentStatus(intentId: string): Promise<PaymentStatus> {
    // TODO: const intent = await this.stripe.paymentIntents.retrieve(intentId)
    console.log(`Getting status for: ${intentId}`);
    return PaymentStatus.PENDING;
  }
}

// ─── PayFast Provider ────────────────────────────────────────────────────────

export class PayFastProvider implements PaymentProvider {
  name = "payfast";

  // PayFast credentials loaded from environment
  private merchantId = process.env.PAYFAST_MERCHANT_ID ?? "";
  private merchantKey = process.env.PAYFAST_MERCHANT_KEY ?? "";
  private passphrase = process.env.PAYFAST_PASSPHRASE ?? "";

  async createPaymentIntent(
    amount: number,
    currency = "pkr",
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    // TODO: Build PayFast payment URL and signature
    // Reference: https://developers.payfast.co.za/docs
    void this.merchantId;
    void this.merchantKey;
    void this.passphrase;

    return {
      id: `pf_placeholder_${Date.now()}`,
      amount,
      currency,
      status: PaymentStatus.PENDING,
      provider: "payfast",
      metadata,
    };
  }

  async confirmPayment(intentId: string): Promise<PaymentIntent> {
    return {
      id: intentId,
      amount: 0,
      currency: "pkr",
      status: PaymentStatus.PAID,
      provider: "payfast",
    };
  }

  async refundPayment(_intentId: string, _amount?: number): Promise<boolean> {
    return true;
  }

  async getPaymentStatus(_intentId: string): Promise<PaymentStatus> {
    return PaymentStatus.PENDING;
  }
}

// ─── COD Provider ────────────────────────────────────────────────────────────

export class CashOnDeliveryProvider implements PaymentProvider {
  name = "cod";

  async createPaymentIntent(
    amount: number,
    currency = "pkr",
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    return {
      id: `cod_${Date.now()}`,
      amount,
      currency,
      status: PaymentStatus.PENDING,
      provider: "cod",
      metadata,
    };
  }

  async confirmPayment(intentId: string): Promise<PaymentIntent> {
    return {
      id: intentId,
      amount: 0,
      currency: "pkr",
      // COD is only paid on delivery — mark pending until driver confirms
      status: PaymentStatus.PENDING,
      provider: "cod",
    };
  }

  async refundPayment(_intentId: string, _amount?: number): Promise<boolean> {
    return true;
  }

  async getPaymentStatus(_intentId: string): Promise<PaymentStatus> {
    return PaymentStatus.PENDING;
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const providers: Record<string, PaymentProvider> = {
  [PaymentMethod.STRIPE]: new StripeProvider(),
  [PaymentMethod.PAYFAST]: new PayFastProvider(),
  [PaymentMethod.COD]: new CashOnDeliveryProvider(),
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  const provider = providers[method];
  if (!provider) throw new Error(`Unsupported payment method: ${method}`);
  return provider;
}
