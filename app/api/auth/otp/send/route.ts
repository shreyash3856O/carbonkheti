import { NextResponse } from "next/server";
import { smsAdapter } from "@/lib/adapters/sms";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Clean and validate Indian 10-digit number
    const cleaned = phone.replace(/\D/g, "");
    const normalized = cleaned.length === 10 ? `+91${cleaned}` : cleaned.startsWith("91") && cleaned.length === 12 ? `+${cleaned}` : phone;

    if (!/^\+91[6-9]\d{9}$/.test(normalized)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    const otp = process.env.SMS_PROVIDER === "stub" || !process.env.SMS_PROVIDER ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
    
    await smsAdapter.sendOTP(normalized, otp);

    return NextResponse.json({
      success: true,
      phone: normalized,
      isStub: true,
      message: "OTP sent successfully. (In dev test mode: 123456)",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
