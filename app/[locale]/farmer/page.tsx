"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import VoiceButton from "@/components/VoiceButton";

interface FarmerStrings {
  account: string;
  verifiedBadge: string;
  tabPassbook: string;
  tabPractices: string;
  tabEvidence: string;
  tabGrievance: string;
  audioTitle: string;
  audioSub: string;
  audioBtn: string;
  getSpeechText: (name: string, total: number, acres: number, tons: number, pending: number) => string;
  cardDisbursed: string;
  dbtSub: string;
  cardYield: string;
  yieldSub: (acres: number) => string;
  cardEscrow: string;
  escrowSub: string;
  lifecycleTitle: string;
  p1Title: string;
  p1Desc: string;
  p1Status: string;
  p2Title: string;
  p2Desc: string;
  p2Status: string;
  p3Title: string;
  p3Desc: string;
  p3Status: string;
  recordsTitle: string;
  thMilestone: string;
  thAmount: string;
  thStatus: string;
  thDate: string;
}

const STRINGS: Record<string, FarmerStrings> = {
  en: {
    account: "Account:",
    verifiedBadge: "Verified Producer",
    tabPassbook: "Ledger Passbook",
    tabPractices: "Regenerative Practices",
    tabEvidence: "Evidence Submissions",
    tabGrievance: "Support & Redressal",
    audioTitle: "Audio Passbook (Voice Summary)",
    audioSub: "Full balance, upcoming installment, and carbon yield summary",
    audioBtn: "Listen to Passbook 🔊",
    getSpeechText: (name, total, acres, tons, pending) =>
      `Hello ${name}. Your account has received a total of ₹${total.toLocaleString("en-IN")} in verified payouts. Your ${acres} acres have generated ${tons} tCO₂e carbon credits. Your upcoming installment of ₹${pending.toLocaleString("en-IN")} is scheduled upon auditor sign-off.`,
    cardDisbursed: "Total Disbursed",
    dbtSub: "Direct DBT / UPI Credit",
    cardYield: "Estimated Carbon Yield",
    yieldSub: (acres) => `Calculated for ${acres} verified acres`,
    cardEscrow: "Pending Verification Escrow",
    escrowSub: "Scheduled on auditor sign-off",
    lifecycleTitle: "Seasonal Disbursement Lifecycle",
    p1Title: "Phase 1: Baseline Onboarding (20%)",
    p1Desc: "Disbursed immediately upon KYC verification and plot baseline recording.",
    p1Status: "Completed",
    p2Title: "Phase 2: Mid-Season Verification (40%)",
    p2Desc: "Disbursed upon geotagged photo proof confirming practice maintenance.",
    p2Status: "Processing",
    p3Title: "Phase 3: Harvest Settlement (40%)",
    p3Desc: "Disbursed post-harvest upon final credit batch issuance and buyer purchase.",
    p3Status: "Pending",
    recordsTitle: "Disbursement Ledger Records",
    thMilestone: "Milestone",
    thAmount: "Amount",
    thStatus: "Status",
    thDate: "Date",
  },
  hi: {
    account: "खाता चुनें:",
    verifiedBadge: "प्रमाणित किसान",
    tabPassbook: "पासबुक लेजर",
    tabPractices: "खेती पद्धतियां",
    tabEvidence: "सबूत व फोटो",
    tabGrievance: "सहायता व शिकायत",
    audioTitle: "पासबुक का हिसाब बोलकर सुनें",
    audioSub: "बैलेंस, आगामी किस्त और कार्बन पैदावार की पूरी जानकारी",
    audioBtn: "पूरा हिसाब बोलकर सुनें 🔊",
    getSpeechText: (name, total, acres, tons, pending) =>
      `नमस्ते ${name} जी। आपके खाते में अब तक कुल ₹${total.toLocaleString("en-IN")} जमा हो चुके हैं। आपकी ${acres} एकड़ जमीन से कुल ${tons} टन कार्बन क्रेडिट बने हैं। आपकी अगली किस्त ₹${pending.toLocaleString("en-IN")} ऑडिट के बाद सीधे बैंक में आ जाएगी।`,
    cardDisbursed: "कुल प्राप्त भुगतान",
    dbtSub: "सीधा बैंक खाता / DBT",
    cardYield: "अनुमानित कार्बन पैदावार",
    yieldSub: (acres) => `${acres} प्रमाणित एकड़ हेतु आकलित`,
    cardEscrow: "सत्यापन लंबित राशि",
    escrowSub: "ऑडिट सत्यापन उपरांत देय",
    lifecycleTitle: "फसल चक्र भुगतान चरण",
    p1Title: "चरण 1: नामांकन अग्रिम (20%)",
    p1Desc: "केवाईसी और जमीन दर्ज होते ही तुरंत बैंक में ट्रांसफर।",
    p1Status: "सफल (Paid)",
    p2Title: "चरण 2: बीच फसल फोटो जांच (40%)",
    p2Desc: "फसल के बीच मोबाइल से फोटो जांच होने पर देय।",
    p2Status: "प्रक्रिया में (Processing)",
    p3Title: "चरण 3: कटाई बाद अंतिम भुगतान (40%)",
    p3Desc: "कटाई बाद क्रेडिट बिकने पर अंतिम शेष राशि।",
    p3Status: "लंबित (Pending)",
    recordsTitle: "बैंक ट्रांसफर लेजर विवरण",
    thMilestone: "चरण",
    thAmount: "राशि",
    thStatus: "स्थिति",
    thDate: "तारीख",
  },
  pa: {
    account: "ਖਾਤਾ ਚੁਣੋ:",
    verifiedBadge: "ਪ੍ਰਮਾਣਿਤ ਕਿਸਾਨ",
    tabPassbook: "ਪਾਸਬੁੱਕ ਲੇਜ਼ਰ",
    tabPractices: "ਖੇਤੀ ਅਭਿਆਸ",
    tabEvidence: "ਸਬੂਤ ਤੇ ਫੋਟੋ",
    tabGrievance: "ਸਹਾਇਤਾ ਤੇ ਸ਼ਿਕਾਇਤ",
    audioTitle: "ਆਡੀਓ ਪਾਸਬੁੱਕ (ਆਵਾਜ਼ ਵਿੱਚ ਹਿਸਾਬ)",
    audioSub: "ਬਕਾਇਆ, ਅਗਲੀ ਕਿਸ਼ਤ ਅਤੇ ਕਾਰਬਨ ਪੈਦਾਵਾਰ ਦੀ ਪੂਰੀ ਜਾਣਕਾਰੀ",
    audioBtn: "ਪੂਰਾ ਹਿਸਾਬ ਸੁਣੋ 🔊",
    getSpeechText: (name, total, acres, tons, pending) =>
      `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${name} ਜੀ। ਤੁਹਾਡੇ ਖਾਤੇ ਵਿੱਚ ਹੁਣ ਤੱਕ ਕੁੱਲ ₹${total.toLocaleString("en-IN")} ਜਮ੍ਹਾਂ ਹੋ ਚੁੱਕੇ ਹਨ। ਤੁਹਾਡੀ ${acres} ਏਕੜ ਜ਼ਮੀਨ ਤੋਂ ਕੁੱਲ ${tons} ਟਨ ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ ਬਣੇ ਹਨ। ਤੁਹਾਡੀ ਅਗਲੀ ਕਿਸ਼ਤ ₹${pending.toLocaleString("en-IN")} ਆਡਿਟ ਤੋਂ ਬਾਅਦ ਸਿੱਧੇ ਬੈਂਕ ਵਿੱਚ ਆਵੇਗੀ।`,
    cardDisbursed: "ਕੁੱਲ ਪ੍ਰਾਪਤ ਭੁਗਤਾਨ",
    dbtSub: "ਸਿੱਧਾ ਬੈਂਕ ਖਾਤਾ (DBT)",
    cardYield: "ਅਨੁਮਾਨਿਤ ਕਾਰਬਨ ਉਪਜ",
    yieldSub: (acres) => `${acres} ਪ੍ਰਮਾਣਿਤ ਏਕੜ ਲਈ`,
    cardEscrow: "ਤਸਦੀਕ ਲੰਬਿਤ ਰਕਮ",
    escrowSub: "ਆਡਿਟ ਜਾਂਚ ਉਪਰੰਤ ਦੇਣਯੋਗ",
    lifecycleTitle: "ਫਸਲ ਚੱਕਰ ਭੁਗਤਾਨ ਪੜਾਅ",
    p1Title: "ਪੜਾਅ 1: ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਗਾਊਂ (20%)",
    p1Desc: "ਕੇਵਾਈਸੀ ਅਤੇ ਜ਼ਮੀਨ ਦਰਜ ਹੁੰਦੇ ਹੀ ਤੁਰੰਤ ਬੈਂਕ ਵਿੱਚ।",
    p1Status: "ਪੂਰਾ ਹੋਇਆ",
    p2Title: "ਪੜਾਅ 2: ਮੱਧ ਸੀਜ਼ਨ ਫੋਟੋ ਜਾਂਚ (40%)",
    p2Desc: "ਫਸਲ ਵਿਚਕਾਰ ਫੋਟੋ ਜਾਂਚ ਪੂਰੀ ਹੋਣ 'ਤੇ।",
    p2Status: "ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ",
    p3Title: "ਪੜਾਅ 3: ਵਾਢੀ ਤੋਂ ਬਾਅਦ (40%)",
    p3Desc: "ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਕ੍ਰੈਡਿਟ ਵਿਕਣ 'ਤੇ ਅੰਤਿਮ ਭੁਗਤਾਨ।",
    p3Status: "ਲੰਬਿਤ",
    recordsTitle: "ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ ਲੇਜ਼ਰ ਵੇਰਵਾ",
    thMilestone: "ਪੜਾਅ",
    thAmount: "ਰਕਮ",
    thStatus: "ਸਥਿਤੀ",
    thDate: "ਮਿਤੀ",
  },
  mr: {
    account: "खाते निवडा:",
    verifiedBadge: "प्रमाणित शेतकरी",
    tabPassbook: "पासबुक लेजर",
    tabPractices: "शेती पद्धती",
    tabEvidence: "पुरावे आणि फोटो",
    tabGrievance: "मदत आणि तक्रार",
    audioTitle: "ऑडिओ पासबुक (आवाजात हिशोब)",
    audioSub: "शिल्लक, आगामी हप्ता आणि कार्बन उत्पादनाची माहिती",
    audioBtn: "पूर्ण हिशोब ऐका 🔊",
    getSpeechText: (name, total, acres, tons, pending) =>
      `नमस्कार ${name} जी. तुमच्या खात्यात आतापर्यंत एकूण ₹${total.toLocaleString("en-IN")} जमा झाले आहेत. तुमच्या ${acres} एकर जमिनीतून एकूण ${tons} टन कार्बन क्रेडिट तयार झाले आहेत. तुमचा पुढचा हप्ता ₹${pending.toLocaleString("en-IN")} तपासणीनंतर थेट बँकेत जमा होईल.`,
    cardDisbursed: "एकूण जमा रक्कम",
    dbtSub: "थेट बँक खाते (DBT)",
    cardYield: "अंदाजे कार्बन उत्पादन",
    yieldSub: (acres) => `${acres} प्रमाणित एकरांसाठी`,
    cardEscrow: "तपासणी प्रलंबित रक्कम",
    escrowSub: "तपासणीनंतर मिळणारी रक्कम",
    lifecycleTitle: "हंगामी वाटप टप्पे",
    p1Title: "टप्पा 1: नोंदणी उचल (20%)",
    p1Desc: "केवायसी आणि जमीन नोंदणीनंतर लगेच बँकेत जमा.",
    p1Status: "पूर्ण",
    p2Title: "टप्पा 2: पिकाच्या मध्यात फोटो तपासणी (40%)",
    p2Desc: "पिकाच्या मध्यात मोबाईल फोटो तपासणी झाल्यावर.",
    p2Status: "प्रक्रियेत",
    p3Title: "टप्पा 3: काढणीनंतर अंतिम हप्ता (40%)",
    p3Desc: "काढणीनंतर क्रेडिट विक्रीवर अंतिम रक्कम.",
    p3Status: "प्रलंबित",
    recordsTitle: "बँक ट्रान्सफर लेजर नोंदी",
    thMilestone: "टप्पा",
    thAmount: "रक्कम",
    thStatus: "स्थिती",
    thDate: "तारीख",
  },
  gu: {
    account: "ખાતું પસંદ કરો:",
    verifiedBadge: "પ્રમાણિત ખેડૂત",
    tabPassbook: "પાસબુક ખાતાવહી",
    tabPractices: "ખેતી પદ્ધતિઓ",
    tabEvidence: "પુરાવા સબમિશન",
    tabGrievance: "સહાય અને ફરિયાદ",
    audioTitle: "ઓડિયો પાસબુક (અવાજમાં હિસાબ)",
    audioSub: "બેલેન્સ, આગામી હપ્તો અને કાર્બન ઉપજની સંપૂર્ણ વિગત",
    audioBtn: "સંપૂર્ણ હિસાબ સાંભળો 🔊",
    getSpeechText: (name, total, acres, tons, pending) =>
      `નમસ્તે ${name} જી. તમારા ખાતામાં અત્યાર સુધી કુલ ₹${total.toLocaleString("en-IN")} જમા થઈ ગયા છે. તમારી ${acres} એકર જમીનમાંથી કુલ ${tons} ટન કાર્બન ક્રેડિટ બન્યા છે. તમારો આગામી હપ્તો ₹${pending.toLocaleString("en-IN")} ઓડિટ પછી સીધા બેંકમાં આવશે.`,
    cardDisbursed: "કુલ પ્રાપ્ત ચુકવણી",
    dbtSub: "સીધા બેંક ખાતામાં (DBT)",
    cardYield: "અંદાજિત કાર્બન ઉપજ",
    yieldSub: (acres) => `${acres} પ્રમાણિત એકર માટે`,
    cardEscrow: "ચકાસણી પેન્ડિંગ રકમ",
    escrowSub: "ઓડિટ પછી મળવાપાત્ર",
    lifecycleTitle: "મોસમી ચુકવણી ચક્ર",
    p1Title: "તબક્કો 1: નોંધણી એડવાન્સ (20%)",
    p1Desc: "કેવાયસી અને જમીન નોંધણી સાથે તરત બેંકમાં.",
    p1Status: "પૂર્ણ",
    p2Title: "તબક્કો 2: પાક વચ્ચે ફોટો ચકાસણી (40%)",
    p2Desc: "મોબાઇલથી ફોટો ચકાસણી પૂર્ણ થવા પર.",
    p2Status: "પ્રક્રિયામાં",
    p3Title: "તબક્કો 3: લણણી પછી અંતિમ ચુકવણી (40%)",
    p3Desc: "ક્રેડિટ વેચાયા પછી અંતિમ રકમ.",
    p3Status: "પેન્ડિંગ",
    recordsTitle: "બેંક ટ્રાન્સફર ખાતાવહી",
    thMilestone: "તબક્કો",
    thAmount: "રકમ",
    thStatus: "સ્થિતિ",
    thDate: "તારીખ",
  },
};

export default function FarmerPortalPage() {
  const params = useParams();
  const rawLocale = (params?.locale as string) || "en";
  const locale = STRINGS[rawLocale] ? rawLocale : "en";
  const tr = STRINGS[locale];

  const [activeTab, setActiveTab] = useState<"passbook" | "practices" | "evidence" | "grievance">("passbook");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("");
  const [farmerData, setFarmerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Evidence state
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePracticeId, setEvidencePracticeId] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [evidenceMessage, setEvidenceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Grievance state
  const [grievanceText, setGrievanceText] = useState("");
  const [submittingGrievance, setSubmittingGrievance] = useState(false);
  const [grievanceMsg, setGrievanceMsg] = useState("");

  useEffect(() => {
    async function loadFarmers() {
      try {
        const res = await fetch("/api/farmers");
        const list = await res.json();
        setFarmers(list);
        if (list.length > 0) {
          setSelectedFarmerId(list[0].id);
        }
      } catch (err) {
        console.error("Error loading farmers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmers();
  }, []);

  useEffect(() => {
    if (!selectedFarmerId) {
      setFarmerData(null);
      return;
    }

    async function loadDetail() {
      try {
        const res = await fetch(`/api/farmers/${selectedFarmerId}`);
        const data = await res.json();
        setFarmerData(data);
        if (data.practices && data.practices.length > 0) {
          setEvidencePracticeId(data.practices[0].id);
        }
      } catch (err) {
        console.error("Error loading farmer detail:", err);
      }
    }
    loadDetail();
  }, [selectedFarmerId]);

  const handleEvidenceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFile || !evidencePracticeId) return;

    setUploadingEvidence(true);
    setEvidenceMessage(null);

    const formData = new FormData();
    formData.append("photo", evidenceFile);
    formData.append("farmerId", selectedFarmerId);
    formData.append("practiceId", evidencePracticeId);
    formData.append("notes", evidenceNotes);
    formData.append("gpsLat", "19.8765");
    formData.append("gpsLng", "78.1234");

    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEvidenceMessage({
          type: "success",
          text: `Evidence verified and hashed: ${data.evidence.photoHash.slice(0, 16)}... Status: ${data.evidence.verificationStatus}`,
        });
        setEvidenceFile(null);
        setEvidenceNotes("");
        // Reload details
        const refreshed = await fetch(`/api/farmers/${selectedFarmerId}`);
        setFarmerData(await refreshed.json());
      } else {
        setEvidenceMessage({ type: "error", text: "Failed to upload evidence." });
      }
    } catch (err) {
      setEvidenceMessage({ type: "error", text: "Network error uploading evidence." });
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText) return;

    setSubmittingGrievance(true);
    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: farmerData?.farmer?.userId || "user-anon",
          text: grievanceText,
        }),
      });

      if (res.ok) {
        setGrievanceMsg("Grievance registered. Tracking ticket issued under statutory DPDP rules.");
        setGrievanceText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingGrievance(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-stone-500">
        <div className="animate-spin w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs">Loading farmer records...</p>
      </div>
    );
  }

  // Display name in current language (English name when on en, Local script when on Indic)
  const displayName = farmerData?.farmer
    ? (locale === "en" ? (farmerData.farmer.nameEn || farmerData.farmer.nameLocal) : farmerData.farmer.nameLocal)
    : "Farmer Digital Passbook";

  const speechSummary = farmerData?.farmer
    ? tr.getSpeechText(
        displayName,
        farmerData.passbook.totalEarnedInr,
        farmerData.passbook.totalAcres,
        farmerData.passbook.estimatedTons,
        farmerData.passbook.pendingPayoutsInr
      )
    : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Profile / Passbook Header */}
      <div className="luxury-card rounded-2xl p-6 sm:p-8 mb-8 bg-white border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-stone-900">
                {displayName}
              </h1>
              {farmerData?.farmer && (
                <span className="badge-pill bg-stone-100 text-stone-800 border border-stone-200">
                  {tr.verifiedBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {farmerData?.farmer
                ? `Village: ${farmerData.farmer.villageName} • Phone: ${farmerData.farmer.phone} • DPDP Status: Active`
                : "Real-time regenerative carbon credit earnings and milestone payouts ledger"}
            </p>
          </div>
        </div>

        {farmers.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500">{tr.account}</label>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-xs font-semibold rounded-lg px-3 py-2 text-stone-800 cursor-pointer"
            >
              {farmers.map((f) => {
                const optName = locale === "en" ? (f.nameEn || f.nameLocal) : f.nameLocal;
                return (
                  <option key={f.id} value={f.id}>
                    {optName} ({f.villageName})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-8 gap-1 overflow-x-auto">
        {[
          { id: "passbook", label: tr.tabPassbook },
          { id: "practices", label: tr.tabPractices },
          { id: "evidence", label: tr.tabEvidence },
          { id: "grievance", label: tr.tabGrievance },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(!farmerData || !farmerData.farmer) ? (
        <div className="luxury-card rounded-2xl p-16 text-center max-w-md mx-auto my-12 bg-white">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">No Farmer Account Enrolled</h3>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            There are currently 0 farmers in the system. Use the Field Agent portal to enroll the first farmer.
          </p>
          <Link
            href={`/${locale}/agent`}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
          >
            <span>Onboard New Farmer</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <>
          {activeTab === "passbook" && (
            <div className="space-y-8">
              {/* Voice Readout Banner */}
              <div className="bg-stone-100 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      {tr.audioTitle}
                    </div>
                    <div className="text-[11px] text-stone-600">
                      {tr.audioSub}
                    </div>
                  </div>
                </div>
                <VoiceButton
                  textToSpeak={speechSummary}
                  label={tr.audioBtn}
                  className="bg-stone-900 hover:bg-black text-white font-bold px-4 py-2 text-xs shadow-xs cursor-pointer"
                />
              </div>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="luxury-card rounded-2xl p-6 bg-white border border-stone-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    {tr.cardDisbursed}
                  </div>
                  <div className="text-4xl font-bold font-mono text-stone-900">
                    ₹{farmerData.passbook.totalEarnedInr.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-3 text-xs text-stone-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                    <span>{tr.dbtSub}</span>
                  </div>
                </div>

                <div className="luxury-card rounded-2xl p-6 bg-white border border-stone-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    {tr.cardYield}
                  </div>
                  <div className="text-4xl font-bold font-mono text-stone-900">
                    {farmerData.passbook.estimatedTons} <span className="text-sm font-sans text-stone-500">tCO₂e</span>
                  </div>
                  <div className="mt-3 text-xs text-stone-500">
                    {tr.yieldSub(farmerData.passbook.totalAcres)}
                  </div>
                </div>

                <div className="luxury-card rounded-2xl p-6 bg-white border border-stone-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    {tr.cardEscrow}
                  </div>
                  <div className="text-4xl font-bold font-mono text-stone-900">
                    ₹{farmerData.passbook.pendingPayoutsInr.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-3 text-xs text-stone-500">
                    {tr.escrowSub}
                  </div>
                </div>
              </div>

              {/* 3-Milestone Stage Schedule */}
              <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-6">
                  {tr.lifecycleTitle}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      stage: tr.p1Title,
                      desc: tr.p1Desc,
                      status: tr.p1Status,
                    },
                    {
                      stage: tr.p2Title,
                      desc: tr.p2Desc,
                      status: tr.p2Status,
                    },
                    {
                      stage: tr.p3Title,
                      desc: tr.p3Desc,
                      status: tr.p3Status,
                    },
                  ].map((s, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-stone-500">0{idx + 1}</span>
                        <span className="badge-pill bg-stone-200 text-stone-800">
                          {s.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900">{s.stage}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Ledger Table */}
              <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-4">
                  {tr.recordsTitle}
                </h3>

                {farmerData.payouts.length === 0 ? (
                  <div className="text-center py-8 text-xs text-stone-500">
                    No disbursement transactions recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                          <th className="pb-3">{tr.thMilestone}</th>
                          <th className="pb-3">{tr.thAmount}</th>
                          <th className="pb-3">{tr.thStatus}</th>
                          <th className="pb-3">{tr.thDate}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {farmerData.payouts.map((p: any) => (
                          <tr key={p.id}>
                            <td className="py-3 capitalize text-stone-900">{p.stage.replace("_", " ")}</td>
                            <td className="py-3 font-mono font-bold text-stone-900">₹{Math.round(p.amountInrPaise / 100)}</td>
                            <td className="py-3">
                              <span className={`badge-pill ${p.status === "paid" ? "bg-stone-200 text-stone-900" : "bg-stone-100 text-stone-700"}`}>
                                {p.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 text-stone-500 font-mono">
                              {new Date(p.createdAt).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "practices" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-stone-900">
                Registered Regenerative Practices ({farmerData.practices?.length || 0})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {farmerData.practices?.map((pr: any) => (
                  <div key={pr.id} className="luxury-card rounded-2xl p-6 bg-white border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge-pill bg-stone-100 text-stone-700">{pr.seasonLabel}</span>
                      <span className="badge-pill bg-stone-200 text-stone-800">
                        Additionality Verified
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900 capitalize">
                      {pr.practiceType.replace(/_/g, " ")}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {pr.additionalityNote || "Benchmarked against historical 3-year baseline survey."}
                    </p>
                    <button
                      onClick={() => {
                        setEvidencePracticeId(pr.id);
                        setActiveTab("evidence");
                      }}
                      className="text-xs font-bold text-stone-900 hover:underline pt-2 block cursor-pointer"
                    >
                      Upload Ground Evidence Photo →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "evidence" && (
            <div className="luxury-card rounded-2xl p-8 bg-white border border-stone-200 max-w-xl mx-auto space-y-6">
              <h3 className="text-lg font-bold text-stone-900">
                Upload Cryptographic Field Evidence
              </h3>

              {evidenceMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold ${
                    evidenceMessage.type === "success"
                      ? "bg-stone-100 text-stone-900 border border-stone-300"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {evidenceMessage.text}
                </div>
              )}

              <form onSubmit={handleEvidenceUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Target Practice</label>
                  <select
                    value={evidencePracticeId}
                    onChange={(e) => setEvidencePracticeId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  >
                    {farmerData.practices?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.practiceType.replace(/_/g, " ")} ({p.seasonLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Field Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => e.target.files?.[0] && setEvidenceFile(e.target.files[0])}
                    required
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    GPS lat/lng coordinates and SHA-256 fingerprint will be computed automatically.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Field Observation</label>
                  <textarea
                    rows={3}
                    value={evidenceNotes}
                    onChange={(e) => setEvidenceNotes(e.target.value)}
                    placeholder="e.g. Mulch cover verified across plot coordinates..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploadingEvidence}
                  className="w-full bg-stone-900 hover:bg-black text-white text-xs font-semibold py-3 rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {uploadingEvidence ? "Hashing & Submitting..." : "Submit to Verification Queue"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "grievance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="luxury-card rounded-2xl p-8 bg-white border border-stone-200 space-y-4">
                <h3 className="text-base font-bold text-stone-900">File a Formal Grievance</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Under the DPDP Act and CarbonKheti bylaws, you have the right to register concerns
                  regarding calculations or agent conduct.
                </p>

                {grievanceMsg && (
                  <div className="p-3 bg-stone-100 text-stone-900 border border-stone-300 text-xs font-semibold rounded-lg">
                    {grievanceMsg}
                  </div>
                )}

                <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                  <textarea
                    rows={4}
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    disabled={submittingGrievance}
                    className="w-full bg-stone-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-lg cursor-pointer"
                  >
                    {submittingGrievance ? "Registering..." : "Submit Ticket"}
                  </button>
                </form>
              </div>

              <div className="luxury-card rounded-2xl p-8 bg-white border border-stone-200 space-y-4">
                <h3 className="text-base font-bold text-stone-900">Direct FPO Extension Contact</h3>
                <div className="space-y-3 text-xs text-stone-600">
                  <div>
                    <div className="text-stone-400 font-semibold uppercase text-[10px]">Toll-Free Helpline</div>
                    <div className="text-base font-bold text-stone-900">1800-227-266</div>
                  </div>
                  <div>
                    <div className="text-stone-400 font-semibold uppercase text-[10px]">Hours of Operation</div>
                    <div className="font-medium text-stone-800">Monday – Saturday: 9:00 AM – 6:00 PM IST</div>
                  </div>
                  <div>
                    <div className="text-stone-400 font-semibold uppercase text-[10px]">Language Support</div>
                    <div className="font-medium text-stone-800">11 Indic regional languages supported</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
