/**
 * SMS / OTP Adapter
 * 
 * Interface: send OTP to a +91 phone number.
 * 
 * STUB MODE (SMS_PROVIDER=stub):
 *   - Always sends OTP "123456"
 *   - Logs to console only
 *   - NOT for production use
 * 
 * PROD MODE: Set SMS_PROVIDER=msg91 or SMS_PROVIDER=twilio
 * and fill in the corresponding env vars.
 */

export interface SMSAdapter {
  sendOTP(phone: string, otp: string): Promise<{ success: boolean; error?: string }>;
}

class StubSMSAdapter implements SMSAdapter {
  async sendOTP(phone: string, otp: string) {
    console.log(
      `[SMS STUB] OTP for ${phone}: ${otp} — ⚠️ SMS not connected. Use "123456" in dev.`
    );
    return { success: true };
  }
}

class MSG91Adapter implements SMSAdapter {
  private authKey = process.env.MSG91_AUTHKEY!;
  private templateId = process.env.MSG91_TEMPLATE_ID!;
  private senderId = process.env.MSG91_SENDER_ID!;

  async sendOTP(phone: string, otp: string) {
    // Strip +91 prefix for MSG91
    const mobile = phone.replace(/^\+91/, "");
    const res = await fetch(
      `https://control.msg91.com/api/v5/otp?template_id=${this.templateId}&mobile=91${mobile}&authkey=${this.authKey}&otp=${otp}`,
      { method: "GET" }
    );
    const data = await res.json();
    if (data.type === "success") return { success: true };
    return { success: false, error: data.message };
  }
}

class TwilioAdapter implements SMSAdapter {
  async sendOTP(phone: string, otp: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const from = process.env.TWILIO_FROM_NUMBER!;
    const body = `Your CarbonKheti OTP is: ${otp}. Valid for 10 minutes.`;
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: phone, From: from, Body: body }),
      }
    );
    const data = await res.json();
    if (data.sid) return { success: true };
    return { success: false, error: data.message };
  }
}

function createSMSAdapter(): SMSAdapter {
  const provider = process.env.SMS_PROVIDER ?? "stub";
  switch (provider) {
    case "msg91":
      return new MSG91Adapter();
    case "twilio":
      return new TwilioAdapter();
    default:
      return new StubSMSAdapter();
  }
}

export const smsAdapter = createSMSAdapter();
