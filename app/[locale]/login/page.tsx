"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"farmer" | "agent" | "factory_buyer" | "admin">("farmer");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
      } else {
        setStep("otp");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, role, language: locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid code");
      } else {
        if (role === "farmer") router.push(`/${locale}/farmer`);
        else if (role === "agent") router.push(`/${locale}/agent`);
        else if (role === "factory_buyer") router.push(`/${locale}/factory`);
        else router.push(`/${locale}/admin`);
      }
    } catch {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full luxury-card rounded-2xl p-8 bg-white border border-stone-200 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Terminal Authentication
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Access the CarbonKheti agricultural carbon exchange
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-lg">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Participant Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "farmer", label: "Smallholder Farmer" },
                  { id: "agent", label: "FPO Extension Agent" },
                  { id: "factory_buyer", label: "Factory / ESG Buyer" },
                  { id: "admin", label: "MRV Auditor" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={`p-2.5 rounded-lg border text-xs font-semibold transition-all text-left ${
                      role === r.id
                        ? "border-[#0c2e20] bg-emerald-50 text-[#0c2e20] ring-1 ring-[#0c2e20]"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Registered Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-200 bg-stone-50 text-stone-500 text-xs font-mono font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-r-lg text-xs font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold py-3 rounded-lg disabled:opacity-50 transition-all"
            >
              {loading ? "Transmitting OTP..." : "Request Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-stone-700">Enter Verification Code</label>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-xs text-emerald-800 hover:underline"
                >
                  Edit Number
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-center text-xl font-mono font-bold tracking-widest"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Verification code dispatched to +91 {phone} (Test code: 123456)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold py-3 rounded-lg disabled:opacity-50 transition-all"
            >
              {loading ? "Authenticating..." : "Authorize Access"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
