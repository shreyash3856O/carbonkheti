/**
 * Payment Adapter
 *
 * ⚠️ PAYMENTS NOT LIVE IN V1 ⚠️
 *
 * This is a stub. All payout recording is done manually by an admin.
 * Set PAYMENT_PROVIDER=razorpay or =cashfree with the respective env vars
 * when connecting a real provider.
 */

export interface PayoutRequest {
  farmerId: string;
  amountInrPaise: number; // integer paise
  upiId?: string;
  bankAccount?: { accountNumber: string; ifsc: string; name: string };
  reference: string;
}

export interface PayoutResult {
  success: boolean;
  providerRef?: string;
  error?: string;
  isStub: boolean;
}

export interface PaymentAdapter {
  isLive: boolean;
  initiatePayout(req: PayoutRequest): Promise<PayoutResult>;
  checkPayoutStatus(providerRef: string): Promise<{ status: "pending" | "paid" | "failed"; error?: string }>;
}

class StubPaymentAdapter implements PaymentAdapter {
  isLive = false;

  async initiatePayout(req: PayoutRequest): Promise<PayoutResult> {
    console.log(
      `[PAYMENT STUB] ⚠️ Payout NOT sent. Farmer: ${req.farmerId}, Amount: ₹${(req.amountInrPaise / 100).toFixed(2)}, Ref: ${req.reference}`
    );
    return {
      success: true,
      providerRef: `STUB-${req.reference}`,
      isStub: true,
    };
  }

  async checkPayoutStatus(providerRef: string) {
    return { status: "pending" as const };
  }
}

class RazorpayAdapter implements PaymentAdapter {
  isLive = true;

  async initiatePayout(req: PayoutRequest): Promise<PayoutResult> {
    // ⚠️ Integrate Razorpay Payout API here
    // https://razorpay.com/docs/razorpay-x/payouts/
    throw new Error("Razorpay payout not yet implemented. Set PAYMENT_PROVIDER=stub.");
  }

  async checkPayoutStatus(providerRef: string): Promise<{ status: "pending" | "paid" | "failed"; error?: string }> {
    throw new Error("Razorpay status check not yet implemented.");
  }
}

function createPaymentAdapter(): PaymentAdapter {
  const provider = process.env.PAYMENT_PROVIDER ?? "stub";
  if (provider === "razorpay") return new RazorpayAdapter();
  return new StubPaymentAdapter();
}

export const paymentAdapter = createPaymentAdapter();
