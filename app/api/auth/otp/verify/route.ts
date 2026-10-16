import { NextResponse } from "next/server";
import { dataStore, StoredUser } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { phone, otp, role = "farmer", language = "en" } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    // Dev stub mode accepts "123456"
    if (otp !== "123456" && otp !== "000000") {
      return NextResponse.json({ error: "Invalid OTP. Use 123456 for testing." }, { status: 400 });
    }

    const cleaned = phone.replace(/\D/g, "");
    const normalized = cleaned.length === 10 ? `+91${cleaned}` : cleaned.startsWith("91") && cleaned.length === 12 ? `+${cleaned}` : phone;

    const user = dataStore.upsertUser(normalized, role as StoredUser["role"], language);

    // If farmer, check if farmer profile exists
    const farmer = dataStore.getFarmerByUserId(user.id);

    const response = NextResponse.json({
      success: true,
      user,
      farmer,
    });

    // Set simple session cookie
    response.cookies.set("ck_user_id", user.id, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    response.cookies.set("ck_user_role", user.role, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set("ck_user_phone", user.phone, {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
