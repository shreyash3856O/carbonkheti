import Link from "next/link";
import { dataStore } from "@/lib/data/store";
import { getTranslations } from "next-intl/server";
import DynamicEcosystemConsole from "@/components/DynamicEcosystemConsole";
import DynamicMethodologyExplorer from "@/components/DynamicMethodologyExplorer";
import LiveTelemetryTicker from "@/components/LiveTelemetryTicker";
import FarmerEarningCalculator from "@/components/FarmerEarningCalculator";
import VoiceButton from "@/components/VoiceButton";

export const dynamic = "force-dynamic";

interface LandingTrans {
  badge: string;
  heroAudio: string;
  listenBtn: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  passbookBtn: string;
  procureBtn: string;
  fpoBtn: string;
  tonsLabel: string;
  tonsUnit: string;
  payoutsLabel: string;
  farmersLabel: string;
  cardSys: string;
  cardSys100: string;
  card1Title: string;
  card1Sub: string;
  card2Title: string;
  card2Sub: string;
  card3Title: string;
  card3Sub: string;
  helpline: string;
  guideTag: string;
  stepsTitle: string;
  stepsSub: string;
  stepsAudio: string;
  stepAudioBtn: string;
  step01Badge: string;
  step01Title: string;
  step01Desc: string;
  step01Rate: string;
  step01Audio: string;
  step02Badge: string;
  step02Title: string;
  step02Desc: string;
  step02Rate: string;
  step02Audio: string;
  step03Badge: string;
  step03Title: string;
  step03Desc: string;
  step03Rate: string;
  step03Audio: string;
  farmersTitle: string;
  farmersSub: string;
  bankReceived: string;
  simTag: string;
  simTitle: string;
  simSub: string;
  splitTag: string;
  splitTitle: string;
  splitDesc: string;
  splitNotice: string;
  splitCol1: string;
  splitCol1Sub: string;
  splitCol2: string;
  splitCol2Sub: string;
  splitCol3: string;
  splitCol3Sub: string;
  splitCol4: string;
  splitCol4Sub: string;
}

const LANDING_TEXTS: Record<string, LandingTrans> = {
  en: {
    badge: "Govt of India CCTS • Farmer Carbon Exchange",
    heroAudio: "Welcome to CarbonKheti. Smallholder farmers practicing climate-smart agriculture earn ₹1,500 to ₹4,000 per acre in annual carbon revenue. 70% of payments are routed directly into your bank account with zero middlemen.",
    listenBtn: "Listen in Audio 🔊",
    heroTitle1: "Earn Carbon From Farming,",
    heroTitle2: "Get Direct Bank Payouts.",
    heroDesc: "Smallholders avoiding stubble burning, adopting zero tillage, and applying biochar earn ₹1,500 to ₹4,000 per acre in additional revenue. 70% direct payment straight to your bank account (DBT/UPI).",
    passbookBtn: "📱 Farmer Passbook",
    procureBtn: "Procure Credits",
    fpoBtn: "FPO Extension",
    tonsLabel: "Certified Carbon",
    tonsUnit: "tons CO₂e",
    payoutsLabel: "Direct Bank Payouts (DBT)",
    farmersLabel: "Enrolled Farmers",
    cardSys: "Transparent Farmer System",
    cardSys100: "100% Local",
    card1Title: "70% Direct Farmer Share",
    card1Sub: "70% of every credit goes straight to the farmer's bank account",
    card2Title: "Zero Paperwork Needed",
    card2Sub: "Just take photos of your farm with a simple smartphone",
    card3Title: "3-Stage Direct DBT",
    card3Sub: "20% on signup, 40% mid-season, 40% post-harvest",
    helpline: "Toll-Free Helpline: 1800-227-266 (Free Support)",
    guideTag: "🌾 Farmer Guide (Simple Steps)",
    stepsTitle: "3 Simple Steps: Direct Farm Income",
    stepsSub: "Without middlemen or brokers, receive 70% cash payout straight into your bank account.",
    stepsAudio: "Farmer brothers, here are the three simple steps. Step 1: Avoid burning stubble, practice zero tillage or apply biochar compost. Step 2: Take geo-tagged farm photos on your smartphone. Step 3: Receive 70% guaranteed payment straight into your bank account via DBT.",
    stepAudioBtn: "Listen to 3 Steps 🔊",
    step01Badge: "Step 01",
    step01Title: "1. Adopt Good Practices",
    step01Desc: "Avoid stubble burning, adopt Zero Tillage, or apply biochar organic manure. Soil retains moisture and fertility.",
    step01Rate: "₹1,500 - ₹4,000 / acre",
    step01Audio: "Step 1: Avoid crop residue burning, use zero tillage or biochar manure.",
    step02Badge: "Step 02",
    step02Title: "2. Snap Photo on Mobile",
    step02Desc: "Zero paperwork. Snap a photo of your field with your smartphone. GPS location and timestamp are recorded automatically.",
    step02Rate: "100% Digital & Easy",
    step02Audio: "Step 2: No paperwork needed. Snap a photo with your mobile. Date and location are recorded automatically.",
    step03Badge: "Step 03",
    step03Title: "3. Direct Cash in Bank",
    step03Desc: "When credits sell, 70% is transferred directly to your bank account or UPI via DBT without deductions.",
    step03Rate: "70% DBT Guaranteed",
    step03Audio: "Step 3: When credits are purchased, 70% is transferred directly to your bank account via DBT.",
    farmersTitle: "Real Indian Farmers — Direct Bank Payouts",
    farmersSub: "Smallholder farmers across Indian states who have already received direct bank payouts",
    bankReceived: "received in bank",
    simTag: "Interactive Platform Simulator",
    simTitle: "Experience as Farmer, FPO, or Corporate Buyer",
    simSub: "Toggle roles below to simulate plot passbooks, extension audits, or CCTS corporate retirement.",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% Direct Payout to Smallholder Farmers",
    splitDesc: "Traditional intermediaries charge up to 80% commission. At CarbonKheti, 70% of every carbon credit goes directly to the farmer.",
    splitNotice: "Payouts are delivered in 3 milestones: 20% on enrollment, 40% on mid-crop audit, and 40% post-harvest.",
    splitCol1: "Farmer Direct Share",
    splitCol1Sub: "Direct UPI / Bank DBT",
    splitCol2: "FPO Operations",
    splitCol2Sub: "Extension & Tech",
    splitCol3: "Independent Audits",
    splitCol3Sub: "Satellite & Ground-truth",
    splitCol4: "Risk Buffer",
    splitCol4Sub: "Weather Protection",
  },
  hi: {
    badge: "भारत सरकार CCTS • किसान कार्बन एक्सचेंज",
    heroAudio: "कार्बनखेती में आपका स्वागत है। यहां अच्छी खेती करने वाले किसान भाइयों को प्रति एकड़ पंद्रह सौ से चार हजार रुपये तक सीधे बैंक खाते में मिलते हैं। सत्तर प्रतिशत पैसा बिना किसी बिचौलिए के सीधे आपके बैंक में आता है।",
    listenBtn: "आवाज़ में सुनें 🔊",
    heroTitle1: "खेती से कार्बन कमाओ,",
    heroTitle2: "सीधे बैंक खाते में पैसा पाओ।",
    heroDesc: "धान की पराली ना जलाने, शून्य जुताई (Zero Tillage) और जैविक खाद अपनाने वाले किसान भाइयों को प्रति एकड़ ₹1,500 से ₹4,000 की अतिरिक्त सालाना आय। 70% सीधा भुगतान आपके बैंक खाते (DBT/UPI) में।",
    passbookBtn: "📱 किसान पासबुक (Farmer Passbook)",
    procureBtn: "फैक्ट्री खरीद (Procure Credits)",
    fpoBtn: "FPO सेवा केंद्र",
    tonsLabel: "कुल प्रमाणित कार्बन",
    tonsUnit: "टन CO₂e",
    payoutsLabel: "सीधा बैंक भुगतान (DBT)",
    farmersLabel: "पंजीकृत किसान",
    cardSys: "पारदर्शी किसान प्रणाली",
    cardSys100: "100% स्थानीय",
    card1Title: "70% सीधा किसान का हिस्सा",
    card1Sub: "हर क्रेडिट का 70% पैसा सीधे किसान के खाते में",
    card2Title: "कागजों की कोई जरूरत नहीं",
    card2Sub: "बस साधारण मोबाइल से खेत का फोटो खींचें",
    card3Title: "3 किस्तों में सीधा DBT",
    card3Sub: "20% नामांकन पर, 40% बीच फसल, 40% कटाई बाद",
    helpline: "टोल-फ्री हेल्पलाइन: 1800-227-266 (मुफ्त सहायता)",
    guideTag: "🌾 किसान साथी (Simple Guide)",
    stepsTitle: "आसान 3 कदम: खेत से सीधी कमाई",
    stepsSub: "बिना किसी दलाल या बिचौलिए के, अच्छी खेती करने पर 70% नकद राशि सीधे अपने बैंक खाते में पाएं।",
    stepsAudio: "किसान भाइयों के लिए यह तीन सरल कदम हैं। पहला कदम: पराली न जलाएं, शून्य जुताई करें या जैविक खाद डालें। दूसरा कदम: अपने मोबाइल से खेत का फोटो और लोकेशन भेजें। तीसरा कदम: बिना किसी बिचौलिए के 70% गारंटीड पैसा सीधे अपने बैंक खाते में पाएं।",
    stepAudioBtn: "तीनों कदम बोलकर सुनें 🔊",
    step01Badge: "कदम 01",
    step01Title: "1. अच्छी पद्धति अपनाएं",
    step01Desc: "धान की पराली ना जलाएं, शून्य जुताई (Zero Tillage) अपनाएं, या गोबर-बायोचार खाद का उपयोग करें। जमीन में नमी और ताकत बढ़ेगी।",
    step01Rate: "₹1,500 - ₹4,000 / एकड़",
    step01Audio: "कदम 1: धान की पराली ना जलाएं, शून्य जुताई अपनाएं, या बायोचार खाद का उपयोग करें।",
    step02Badge: "कदम 02",
    step02Title: "2. मोबाइल से फोटो भेजें",
    step02Desc: "कागजों की कोई परेशानी नहीं। अपने साधारण फोन से खेत का फोटो खींचें। लोकेशन और तारीख अपने आप दर्ज हो जाती है।",
    step02Rate: "100% डिजिटल व आसान",
    step02Audio: "कदम 2: कागजों की कोई परेशानी नहीं। साधारण फोन से खेत का फोटो खींचें।",
    step03Badge: "कदम 03",
    step03Title: "3. बैंक में सीधा नकद पैसा",
    step03Desc: "क्रेडिट बिकने पर 70% पूरी राशि बिना किसी कटौती के सीधे आपके बैंक खाते या UPI में DBT द्वारा ट्रांसफर होती है।",
    step03Rate: "70% DBT गारंटी",
    step03Audio: "कदम 3: क्रेडिट बिकने पर 70% पूरी राशि सीधे आपके बैंक खाते या UPI में ट्रांसफर होती है।",
    farmersTitle: "वास्तविक किसान भाई — सीधे बैंक खाते में भुगतान",
    farmersSub: "भारत के विभिन्न राज्यों के छोटे किसान जो पहले ही लाभ प्राप्त कर चुके हैं",
    bankReceived: "बैंक में प्राप्त",
    simTag: "Interactive Platform Simulator",
    simTitle: "किसान, FPO या फैक्ट्री भूमिका में अनुभव करें",
    simSub: "नीचे भूमिका बदलकर जमीन का हिसाब, फील्ड ऑडिट या कॉर्पोरेट खरीद का सिमुलेशन देखें।",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% सीधा भुगतान छोटे किसान भाइयों को",
    splitDesc: "पारंपरिक बिचौलिए 80% तक कमीशन काट लेते हैं। कार्बनखेती में हर क्रेडिट की आय का 70% हिस्सा सीधे किसान के खाते में जमा होता है।",
    splitNotice: "भुगतान 3 चरणों में मिलता है: 20% नामांकन पर, 40% बीच फसल फोटो जांच पर, और 40% कटाई के बाद।",
    splitCol1: "किसान का हिस्सा",
    splitCol1Sub: "सीधा UPI / बैंक खाता",
    splitCol2: "FPO संचालन",
    splitCol2Sub: "विस्तार व तकनीक",
    splitCol3: "स्वतंत्र ऑडिट",
    splitCol3Sub: "सैटेलाइट व ग्राउंड ट्रुथ",
    splitCol4: "सुरक्षा बफर",
    splitCol4Sub: "मौसम जोखिम सुरक्षा",
  },
  pa: {
    badge: "ਭਾਰਤ ਸਰਕਾਰ CCTS • ਕਿਸਾਨ ਕਾਰਬਨ ਐਕਸਚੇਂਜ",
    heroAudio: "ਕਾਰਬਨਖੇਤੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਪਰਾਲੀ ਨਾ ਸਾੜਨ ਅਤੇ ਚੰਗੀ ਖੇਤੀ ਕਰਨ ਵਾਲੇ ਕਿਸਾਨ ਵੀਰਾਂ ਨੂੰ ਪ੍ਰਤੀ ਏਕੜ 1,500 ਤੋਂ 4,000 ਰੁਪਏ ਸਿੱਧੇ ਬੈਂਕ ਵਿੱਚ ਮਿਲਦੇ ਹਨ। 70 ਪ੍ਰਤੀਸ਼ਤ ਪੈਸਾ ਬਿਨਾਂ ਕਿਸੇ ਵਿਚੋਲੇ ਦੇ ਸਿੱਧਾ ਤੁਹਾਡੇ ਖਾਤੇ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।",
    listenBtn: "ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ 🔊",
    heroTitle1: "ਖੇਤੀ ਤੋਂ ਕਾਰਬਨ ਕਮਾਓ,",
    heroTitle2: "ਸਿੱਧਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਪਾਓ।",
    heroDesc: "ਪਰਾਲੀ ਨਾ ਸਾੜਨ, ਜ਼ੀਰੋ ਟਿਲੇਜ ਅਤੇ ਜੈਵਿਕ ਖਾਦ ਅਪਣਾਉਣ ਵਾਲੇ ਕਿਸਾਨ ਵੀਰਾਂ ਨੂੰ ਪ੍ਰਤੀ ਏਕੜ ₹1,500 ਤੋਂ ₹4,000 ਦੀ ਸਾਲਾਨਾ ਆਮਦਨ। 70% ਸਿੱਧਾ ਭੁਗਤਾਨ ਬੈਂਕ ਖਾਤੇ (DBT/UPI) ਵਿੱਚ।",
    passbookBtn: "📱 ਕਿਸਾਨ ਪਾਸਬੁੱਕ (Farmer Passbook)",
    procureBtn: "ਕਾਰਖਾਨਾ ਖਰੀਦ (Procure Credits)",
    fpoBtn: "FPO ਸੇਵਾ ਕੇਂਦਰ",
    tonsLabel: "ਕੁੱਲ ਪ੍ਰਮਾਣਿਤ ਕਾਰਬਨ",
    tonsUnit: "ਟਨ CO₂e",
    payoutsLabel: "ਸਿੱਧਾ ਬੈਂਕ ਭੁਗਤਾਨ (DBT)",
    farmersLabel: "ਰਜਿਸਟਰਡ ਕਿਸਾਨ",
    cardSys: "ਪਾਰਦਰਸ਼ੀ ਕਿਸਾਨ ਪ੍ਰਣਾਲੀ",
    cardSys100: "100% ਸਥਾਨਕ",
    card1Title: "70% ਸਿੱਧਾ ਕਿਸਾਨ ਦਾ ਹਿੱਸਾ",
    card1Sub: "ਹਰ ਕ੍ਰੈਡਿਟ ਦਾ 70% ਪੈਸਾ ਸਿੱਧਾ ਕਿਸਾਨ ਦੇ ਖਾਤੇ ਵਿੱਚ",
    card2Title: "ਕਾਗਜ਼ਾਂ ਦੀ ਕੋਈ ਲੋੜ ਨਹੀਂ",
    card2Sub: "ਸਿਰਫ਼ ਮੋਬਾਈਲ ਨਾਲ ਖੇਤ ਦੀ ਫੋਟੋ ਖਿੱਚੋ",
    card3Title: "3 ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਸਿੱਧਾ DBT",
    card3Sub: "20% ਰਜਿਸਟ੍ਰੇਸ਼ਨ 'ਤੇ, 40% ਮੱਧ ਸੀਜ਼ਨ, 40% ਵਾਢੀ ਬਾਅਦ",
    helpline: "ਟੋਲ-ਫ੍ਰੀ ਹੈਲਪਲਾਈਨ: 1800-227-266 (ਮੁਫ਼ਤ ਸਹਾਇਤਾ)",
    guideTag: "🌾 ਕਿਸਾਨ ਮਾਰਗਦਰਸ਼ਕ (ਸੌਖੇ ਕਦਮ)",
    stepsTitle: "ਸੌਖੇ 3 ਕਦਮ: ਖੇਤ ਤੋਂ ਸਿੱਧੀ ਕਮਾਈ",
    stepsSub: "ਬਿਨਾਂ ਕਿਸੇ ਵਿਚੋਲੇ ਦੇ, ਚੰਗੀ ਖੇਤੀ ਕਰਨ 'ਤੇ 70% ਰਕਮ ਸਿੱਧੀ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪ੍ਰਾਪਤ ਕਰੋ।",
    stepsAudio: "ਕਿਸਾਨ ਵੀਰੋ, ਇਹ ਤਿੰਨ ਸੌਖੇ ਕਦਮ ਹਨ। ਪਹਿਲਾ: ਪਰਾਲੀ ਨਾ ਸਾੜੋ, ਜ਼ੀਰੋ ਟਿਲੇਜ ਕਰੋ। ਦੂਜਾ: ਮੋਬਾਈਲ ਨਾਲ ਫੋਟੋ ਭੇਜੋ। ਤੀਜਾ: 70% ਸਿੱਧਾ ਪੈਸਾ ਬੈਂਕ ਵਿੱਚ ਪ੍ਰਾਪਤ ਕਰੋ।",
    stepAudioBtn: "ਤਿੰਨੋਂ ਕਦਮ ਸੁਣੋ 🔊",
    step01Badge: "ਕਦਮ 01",
    step01Title: "1. ਚੰਗਾ ਤਰੀਕਾ ਅਪਣਾਓ",
    step01Desc: "ਪਰਾਲੀ ਨਾ ਸਾੜੋ, ਹੈਪੀ ਸੀਡਰ / ਜ਼ੀਰੋ ਟਿਲੇਜ ਅਪਣਾਓ। ਜ਼ਮੀਨ ਵਿੱਚ ਨਮੀ ਅਤੇ ਉਪਜਾਊ ਸ਼ਕਤੀ ਵਧੇਗੀ।",
    step01Rate: "₹1,500 - ₹4,000 / ਏਕੜ",
    step01Audio: "ਕਦਮ 1: ਪਰਾਲੀ ਨਾ ਸਾੜੋ, ਹੈਪੀ ਸੀਡਰ ਚਲਾਓ।",
    step02Badge: "ਕਦਮ 02",
    step02Title: "2. ਮੋਬਾਈਲ ਨਾਲ ਫੋਟੋ ਭੇਜੋ",
    step02Desc: "ਕਾਗਜ਼ੀ ਕਾਰਵਾਈ ਦੀ ਲੋੜ ਨਹੀਂ। ਸਾਧਾਰਨ ਫੋਨ ਨਾਲ ਖੇਤ ਦੀ ਫੋਟੋ ਖਿੱਚੋ, ਸਥਾਨ ਆਪੇ ਦਰਜ ਹੋ ਜਾਵੇਗਾ।",
    step02Rate: "100% ਡਿਜੀਟਲ ਤੇ ਸੌਖਾ",
    step02Audio: "ਕਦਮ 2: ਕਾਗਜ਼ਾਂ ਦੀ ਕੋਈ ਲੋੜ ਨਹੀਂ, ਫੋਨ ਤੋਂ ਫੋਟੋ ਭੇਜੋ।",
    step03Badge: "ਕਦਮ 03",
    step03Title: "3. ਬੈਂਕ ਵਿੱਚ ਸਿੱਧੀ ਰਕਮ",
    step03Desc: "ਕ੍ਰੈਡਿਟ ਵਿਕਣ 'ਤੇ 70% ਪੂਰੀ ਰਕਮ ਬਿਨਾਂ ਕਟੌਤੀ ਦੇ ਸਿੱਧੇ ਤੁਹਾਡੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਆਵੇਗੀ।",
    step03Rate: "70% DBT ਗਾਰੰਟੀ",
    step03Audio: "ਕਦਮ 3: 70% ਪੂਰਾ ਪੈਸਾ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਟਰਾਂਸਫਰ ਹੋਵੇਗਾ।",
    farmersTitle: "ਅਸਲ ਕਿਸਾਨ ਵੀਰ — ਸਿੱਧਾ ਬੈਂਕ ਭੁਗਤਾਨ",
    farmersSub: "ਪੰਜਾਬ ਅਤੇ ਹੋਰ ਰਾਜਾਂ ਦੇ ਕਿਸਾਨ ਜਿਨ੍ਹਾਂ ਨੇ ਸਿੱਧਾ ਲਾਭ ਪ੍ਰਾਪਤ ਕੀਤਾ ਹੈ",
    bankReceived: "ਬੈਂਕ ਵਿੱਚ ਜਮ੍ਹਾ",
    simTag: "Interactive Platform Simulator",
    simTitle: "ਕਿਸਾਨ, FPO ਜਾਂ ਕਾਰਖਾਨਾ ਭੂਮਿਕਾ ਵਿੱਚ ਵੇਖੋ",
    simSub: "ਭੂਮਿਕਾ ਬਦਲ ਕੇ ਜ਼ਮੀਨ ਦਾ ਹਿਸਾਬ ਜਾਂ ਖਰੀਦਦਾਰੀ ਵੇਖੋ।",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% ਸਿੱਧਾ ਭੁਗਤਾਨ ਛੋਟੇ ਕਿਸਾਨ ਵੀਰਾਂ ਨੂੰ",
    splitDesc: "ਵਿਚੋਲੇ ਵੱਡੀ ਕਟੌਤੀ ਕਰਦੇ ਹਨ। ਕਾਰਬਨਖੇਤੀ ਵਿੱਚ 70% ਪੈਸਾ ਸਿੱਧਾ ਕਿਸਾਨ ਦੇ ਖਾਤੇ ਵਿੱਚ ਜਾਂਦਾ ਹੈ।",
    splitNotice: "ਭੁਗਤਾਨ 3 ਪੜਾਵਾਂ ਵਿੱਚ: 20% ਰਜਿਸਟ੍ਰੇਸ਼ਨ 'ਤੇ, 40% ਮੱਧ ਸੀਜ਼ਨ, 40% ਵਾਢੀ ਤੋਂ ਬਾਅਦ।",
    splitCol1: "ਕਿਸਾਨ ਦਾ ਹਿੱਸਾ",
    splitCol1Sub: "ਸਿੱਧਾ UPI / ਬੈਂਕ ਖਾਤਾ",
    splitCol2: "FPO ਸੰਚਾਲਨ",
    splitCol2Sub: "ਤਕਨੀਕ ਤੇ ਸਹਾਇਤਾ",
    splitCol3: "ਸੁਤੰਤਰ ਆਡਿਟ",
    splitCol3Sub: "ਸੈਟੇਲਾਈਟ ਜਾਂਚ",
    splitCol4: "ਸੁਰੱਖਿਆ ਬਫਰ",
    splitCol4Sub: "ਜਲਵਾਯੂ ਸੁਰੱਖਿਆ",
  },
  mr: {
    badge: "भारत सरकार CCTS • शेतकरी कार्बन एक्सचेंज",
    heroAudio: "कार्बनशेतीमध्ये आपले स्वागत आहे. चांगली शेती करणाऱ्या शेतकरी बांधवांना एकरी 1,500 ते 4,000 रुपये थेट बँक खात्यात मिळतात. 70 टक्के रक्कम कोणत्याही दलालाशिवाय थेट खात्यात जमा होते.",
    listenBtn: "आवाजात ऐका 🔊",
    heroTitle1: "शेतीतून कार्बन कमवा,",
    heroTitle2: "थेट बँक खात्यात पैसे मिळवा.",
    heroDesc: "पिकांचे अवशेष न जाळणे, शून्य मशागत आणि सेंद्रिय खतांचा वापर करणाऱ्या शेतकऱ्यांना एकरी ₹1,500 ते ₹4,000 चे अतिरिक्त उत्पन्न. 70% थेट बँक खात्यात (DBT).",
    passbookBtn: "📱 शेतकरी पासबुक",
    procureBtn: "कंपनी खरेदी",
    fpoBtn: "FPO सेवा केंद्र",
    tonsLabel: "एकूण प्रमाणित कार्बन",
    tonsUnit: "टन CO₂e",
    payoutsLabel: "थेट बँक जमा (DBT)",
    farmersLabel: "नोंदणीकृत शेतकरी",
    cardSys: "पारदर्शक शेतकरी प्रणाली",
    cardSys100: "100% स्थानिक",
    card1Title: "70% थेट शेतकऱ्याचा वाटा",
    card1Sub: "प्रत्येक क्रेडिटचे 70% पैसे थेट बँक खात्यात",
    card2Title: "कागदपत्रांची गरज नाही",
    card2Sub: "साध्या मोबाईलने शेताचा फोटो काढा",
    card3Title: "3 हप्त्यांत थेट DBT",
    card3Sub: "20% नोंदणीवर, 40% पिकाच्या मध्यात, 40% काढणीनंतर",
    helpline: "टोल-फ्री हेल्पलाइन: 1800-227-266 (मोफत मदत)",
    guideTag: "🌾 शेतकरी मार्गदर्शक",
    stepsTitle: "सोपे 3 टप्पे: शेतातून थेट उत्पन्न",
    stepsSub: "दलालांशिवाय, चांगल्या शेतीवर 70% रक्कम थेट बँक खात्यात मिळवा.",
    stepsAudio: "शेतकरी बांधवांसाठी हे तीन सोपे टप्पे आहेत. टप्पा 1: अवशेष जाळू नका, शून्य मशागत करा. टप्पा 2: मोबाईलने फोटो पाठवा. टप्पा 3: 70% रक्कम थेट बँकेत मिळवा.",
    stepAudioBtn: "सर्व टप्पे ऐका 🔊",
    step01Badge: "टप्पा 01",
    step01Title: "1. उत्तम पद्धत वापरा",
    step01Desc: "पिकांचे अवशेष जाळू नका, शून्य मशागत किंवा बायोचार खत वापरा. जमिनीत ओलावा टिकून राहील.",
    step01Rate: "₹1,500 - ₹4,000 / एकर",
    step01Audio: "टप्पा 1: पिकांचे अवशेष जाळू नका, शून्य मशागत करा.",
    step02Badge: "टप्पा 02",
    step02Title: "2. मोबाईलने फोटो पाठवा",
    step02Desc: "कागदपत्रांची अडचण नाही. शेताचा फोटो काढा, ठिकाण आणि तारीख आपोआप नोंदवली जाते.",
    step02Rate: "100% डिजिटल व सोपे",
    step02Audio: "टप्पा 2: मोबाईलने फोटो काढा, तारीख व जागा आपोआप नोंदवली जाईल.",
    step03Badge: "टप्पा 03",
    step03Title: "3. थेट बँक खात्यात पैसे",
    step03Desc: "क्रेडिट विकल्यावर 70% रक्कम थेट तुमच्या आधार लिंक बँक खात्यात DBT द्वारे जमा होते.",
    step03Rate: "70% DBT हमी",
    step03Audio: "टप्पा 3: क्रेडिट विकल्यावर 70% रक्कम थेट बँक खात्यात जमा होते.",
    farmersTitle: "प्रत्यक्ष शेतकरी — थेट बँक जमा",
    farmersSub: "महाराष्ट्रातील आणि इतर राज्यांतील शेतकरी ज्यांना थेट पैसे मिळाले आहेत",
    bankReceived: "बँकेत जमा",
    simTag: "Interactive Platform Simulator",
    simTitle: "शेतकरी, FPO किंवा खरेदीदार भूमिकेत पहा",
    simSub: "खाली भूमिका बदलून शेतीचे हिशोब किंवा खरेदी सिम्युलेशन पहा.",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% थेट वाटा लहान शेतकऱ्यांना",
    splitDesc: "पारंपारिक दलाल मोठी कपात करतात. कार्बनशेतीमध्ये 70% उत्पन्न थेट शेतकऱ्याला मिळते.",
    splitNotice: "3 टप्प्यांत पैसे मिळतात: 20% नोंदणीवर, 40% पिकाच्या मध्यात, 40% काढणीनंतर.",
    splitCol1: "शेतकऱ्याचा वाटा",
    splitCol1Sub: "थेट UPI / बँक खाते",
    splitCol2: "FPO संचालन",
    splitCol2Sub: "विस्तार व तंत्रज्ञान",
    splitCol3: "स्वतंत्र तपासणी",
    splitCol3Sub: "सॅटेलाइट ऑडिट",
    splitCol4: "सुरक्षा बफर",
    splitCol4Sub: "हवामान जोखीम सुरक्षा",
  },
  gu: {
    badge: "ભારત સરકાર CCTS • કિસાન કાર્બન એક્સચેન્જ",
    heroAudio: "કાર્બનખેતીમાં તમારું સ્વાગત છે. સારી ખેતી કરતા ખેડૂત ભાઈઓને પ્રતિ એકર 1,500 થી 4,000 રૂપિયા સીધા બેંક ખાતામાં મળે છે. 70 ટકા રકમ વચેટિયા વગર સીધી તમારા ખાતામાં આવે છે.",
    listenBtn: "અવાજમાં સાંભળો 🔊",
    heroTitle1: "ખેતીમાંથી કાર્બન કમાઓ,",
    heroTitle2: "સીધા બેંક ખાતામાં પૈસા મેળવો.",
    heroDesc: "પરાળ ન બાળવા, ઝીરો ટિલેજ અને જૈવિક ખાતર અપનાવનાર ખેડૂતોને પ્રતિ એકર ₹1,500 થી ₹4,000 ની વાર્ષિક આવક. 70% સીધી ચુકવણી તમારા બેંક ખાતામાં.",
    passbookBtn: "📱 કિસાન પાસબુક (Farmer Passbook)",
    procureBtn: "ફેક્ટરી ખરીદી (Procure Credits)",
    fpoBtn: "FPO સેવા કેન્દ્ર",
    tonsLabel: "કુલ પ્રમાણિત કાર્બન",
    tonsUnit: "ટન CO₂e",
    payoutsLabel: "સીધી બેંક ચુકવણી (DBT)",
    farmersLabel: "નોંધાયેલ ખેડૂતો",
    cardSys: "પારદર્શક કિસાન વ્યવસ્થા",
    cardSys100: "100% સ્થાનિક",
    card1Title: "70% સીધો ખેડૂતનો હિસ્સો",
    card1Sub: "દરેક ક્રેડિટના 70% પૈસા સીધા ખેડૂતના ખાતામાં",
    card2Title: "કાગળકામની કોઈ જરૂર નથી",
    card2Sub: "માત્ર ફોનથી ખેતરનો ફોટો પાડો",
    card3Title: "3 હપ્તામાં સીધું DBT",
    card3Sub: "20% નોંધણી પર, 40% પાક વચ્ચે, 40% લણણી પછી",
    helpline: "ટોલ-ફ્રી હેલ્પલાઇન: 1800-227-266 (મફત સહાય)",
    guideTag: "🌾 કિસાન માર્ગદર્શિકા",
    stepsTitle: "સરળ 3 પગલાં: ખેતરમાંથી સીધી આવક",
    stepsSub: "વચેટિયા વગર, સારી ખેતી કરવા પર 70% રકમ સીધી તમારા બેંક ખાતામાં મેળવો.",
    stepsAudio: "ખેડૂત મિત્રો માટે આ ત્રણ સરળ પગલાં છે. પહેલું: પરાળ ન બાળો, ઝીરો ટિલેજ કરો. બીજું: મોબાઈલથી ફોટો મોકલો. ત્રીજું: 70% રકમ સીધી બેંક ખાતામાં મેળવો.",
    stepAudioBtn: "ત્રણેય પગલાં સાંભળો 🔊",
    step01Badge: "પગલું 01",
    step01Title: "1. સારી પદ્ધતિ અપનાવો",
    step01Desc: "પરાળ ન બાળો, ઝીરો ટિલેજ અથવા બાયોચાર ખાતર અપનાવો. જમીનમાં ભેજ અને ફળદ્રુપતા વધશે.",
    step01Rate: "₹1,500 - ₹4,000 / એકર",
    step01Audio: "પગલું 1: પરાળ ન બાળો, ઝીરો ટિલેજ અપનાવો.",
    step02Badge: "પગલું 02",
    step02Title: "2. મોબાઇલથી ફોટો મોકલો",
    step02Desc: "કાગળકામની કોઈ ઝંઝટ નથી. ફોનથી ફોટો પાડો, સ્થાન અને તારીખ આપોઆપ નોંધાઈ જશે.",
    step02Rate: "100% ડિજિટલ અને સરળ",
    step02Audio: "પગલું 2: કાગળોની જરૂર નથી, ફોટો પાડો.",
    step03Badge: "પગલું 03",
    step03Title: "3. બેંકમાં સીધા પૈસા",
    step03Desc: "ક્રેડિટ વેચાય ત્યારે 70% રકમ સીધી તમારા બેંક ખાતામાં DBT દ્વારા જમા થાય છે.",
    step03Rate: "70% DBT ગેરંટી",
    step03Audio: "પગલું 3: 70% રકમ સીધી બેંક ખાતામાં જમા થાય છે.",
    farmersTitle: "વાસ્તવિક ખેડૂતો — સીધી બેંક ચુકવણી",
    farmersSub: "ગુજરાત અને અન્ય રાજ્યોના ખેડૂતો જેમને સીધો લાભ મળ્યો છે",
    bankReceived: "બેંકમાં જમા",
    simTag: "Interactive Platform Simulator",
    simTitle: "ખેડૂત, FPO કે ફેક્ટરી ભૂમિકામાં જુઓ",
    simSub: "નીચે ભૂમિકા બદલીને ખેતીના હિસાબો અથવા ખરીદી સિમ્યુલેશન જુઓ.",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% સીધી ચુકવણી નાના ખેડૂતોને",
    splitDesc: "વચેટિયા મોટી કમિશન કાપે છે. કાર્બનખેતીમાં 70% આવક સીધી ખેડૂતના ખાતામાં જમા થાય છે.",
    splitNotice: "ચુકવણી 3 હપ્તામાં મળે છે: 20% નોંધણી પર, 40% પાક વચ્ચે, 40% લણણી પછી.",
    splitCol1: "ખેડૂતનો હિસ્સો",
    splitCol1Sub: "સીધું UPI / બેંક ખાતું",
    splitCol2: "FPO સંચાલન",
    splitCol2Sub: "વિસ્તરણ અને ટેકનોલોજી",
    splitCol3: "સ્વતંત્ર ઓડિટ",
    splitCol3Sub: "સેટેલાઇટ તપાસ",
    splitCol4: "સુરક્ષા બફર",
    splitCol4Sub: "હવામાન જોખમ સુરક્ષા",
  },
  ta: {
    badge: "இந்திய அரசு CCTS • உழவர் கார்பன் பரிமாற்றம்",
    heroAudio: "கார்பன்சேதிக்கு உங்களை வரவேற்கிறோம். சூழலுக்கு உகந்த விவசாயம் செய்யும் விவசாயிகளுக்கு ஏக்கருக்கு 1,500 முதல் 4,000 ரூபாய் வரை நேரடியாக வங்கி கணக்கில் கிடைக்கும். 70 சதவீத தொகை இடைத்தரகர் இன்றி வங்கியில் சேரும்.",
    listenBtn: "குரலில் கேட்க 🔊",
    heroTitle1: "விவசாயத்தில் கார்பன் சம்பாதியுங்கள்,",
    heroTitle2: "வங்கி கணக்கில் நேரடியாக பணம் பெறுங்கள்.",
    heroDesc: "வைக்கோல் எரிக்காத, பூஜ்ய உழவு மற்றும் இயற்கை உரம் பயன்படுத்தும் விவசாயிகளுக்கு ஏக்கருக்கு ₹1,500 முதல் ₹4,000 வரை கூடுதல் வருமானம். 70% நேரடி வங்கி செலுத்துகை.",
    passbookBtn: "📱 உழவர் பாஸ்புக்",
    procureBtn: "கார்பன் கொள்முதல்",
    fpoBtn: "FPO சேவை மையம்",
    tonsLabel: "சான்றளிக்கப்பட்ட கார்பன்",
    tonsUnit: "டன் CO₂e",
    payoutsLabel: "நேரடி வங்கி செலுத்துகை (DBT)",
    farmersLabel: "பதிவுசெய்த விவசாயிகள்",
    cardSys: "வெளிப்படையான உழவர் கட்டமைப்பு",
    cardSys100: "100% உள்ளூர்",
    card1Title: "70% உழவருக்கு நேரடி பங்கு",
    card1Sub: "ஒவ்வொரு கிரெடிட்டின் 70% தொகை நேரடியாக வங்கிக்கு",
    card2Title: "காகித வேலைகள் எதுவும் இல்லை",
    card2Sub: "ஸ்மார்ட்போனில் புகைப்படம் எடுத்தால் போதும்",
    card3Title: "3 தவணைகளில் நேரடி DBT",
    card3Sub: "20% பதிவில், 40% பயிர் நடுவில், 40% அறுவடைக்கு பின்",
    helpline: "கட்டணமில்லா உதவி எண்: 1800-227-266 (இலவச உதவி)",
    guideTag: "🌾 உழவர் வழிகாட்டி",
    stepsTitle: "எளிய 3 படிகள்: பண்ணையில் இருந்து நேரடி வருமானம்",
    stepsSub: "இடைத்தரகர் இன்றி, சிறந்த விவசாயம் செய்து 70% தொகையை வங்கி கணக்கில் பெறுங்கள்.",
    stepsAudio: "விவசாய தோழர்களுக்கான 3 எளிய படிகள். படி 1: வைக்கோல் எரிக்காதீர்கள், பூஜ்ய உழவு செய்யுங்கள். படி 2: மொபைலில் படம் எடுங்கள். படி 3: 70% தொகையை வங்கியில் பெறுங்கள்.",
    stepAudioBtn: "3 படிகளை கேட்க 🔊",
    step01Badge: "படி 01",
    step01Title: "1. சிறந்த முறையைத் தொடங்குங்கள்",
    step01Desc: "வைக்கோல் எரிக்காதீர்கள், பூஜ்ய உழவு அல்லது பயோசார் பயன்படுத்துங்கள். மண்ணின் வளம் கூடும்.",
    step01Rate: "₹1,500 - ₹4,000 / ஏக்கர்",
    step01Audio: "படி 1: வைக்கோல் எரிக்காமல் நிலத்தில் சேர்க்கவும்.",
    step02Badge: "படி 02",
    step02Title: "2. மொபைலில் படம் எடுங்கள்",
    step02Desc: "காகித வேலை தேவையில்லை. ஸ்மார்ட்போனில் புகைப்படம் எடுங்கள், இடம் தானாக பதிவாகும்.",
    step02Rate: "100% டிஜிட்டல் & எளியது",
    step02Audio: "படி 2: மொபைல் மூலம் படம் எடுக்கவும்.",
    step03Badge: "படி 03",
    step03Title: "3. வங்கியில் நேரடி பணம்",
    step03Desc: "கிரெடிட் விற்கப்பட்டதும் 70% பிடித்தமின்றி நேரடியாக வங்கி கணக்கில் சேரும்.",
    step03Rate: "70% DBT உத்தரவாதம்",
    step03Audio: "படி 3: 70% முழு பணம் வங்கி கணக்கில் சேரும்.",
    farmersTitle: "உண்மையான விவசாயிகள் — நேரடி வங்கி செலுத்துகை",
    farmersSub: "தமிழ்நாடு மற்றும் பிற மாநிலங்களில் பலன் பெற்ற சிறு விவசாயிகள்",
    bankReceived: "வங்கி வரவு",
    simTag: "Interactive Platform Simulator",
    simTitle: "விவசாயி, FPO அல்லது கார்ப்பரேட் பாத்திரத்தில் பாருங்கள்",
    simSub: "கீழே பாத்திரத்தை மாற்றி விவசாயக் கணக்குகளைக் காண்க.",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% நேரடி பங்கு சிறு விவசாயிகளுக்கு",
    splitDesc: "இடைத்தரகர்கள் 80% வரை பிடிக்கிறார்கள். கார்பன்சேதியில் 70% நேரடியாக விவசாயிக்கு செல்கிறது.",
    splitNotice: "3 தவணைகளில் பணம்: 20% பதிவில், 40% பயிர் நடுவில், 40% அறுவடைக்கு பின்.",
    splitCol1: "உழவர் பங்கு",
    splitCol1Sub: "நேரடி UPI / வங்கி கணக்கு",
    splitCol2: "FPO இயக்கம்",
    splitCol2Sub: "தொழில்நுட்ப உதவி",
    splitCol3: "சுயாதீன தணிக்கை",
    splitCol3Sub: "செயற்கைக்கோள் ஆய்வு",
    splitCol4: "இடர் இருப்பு",
    splitCol4Sub: "பருவநிலை பாதுகாப்பு",
  },
  te: {
    badge: "భారత ప్రభుత్వం CCTS • రైతు కార్బన్ ఎక్స్ఛేంజ్",
    heroAudio: "కార్బన్‌ఖేతికి స్వాగతం. మంచి వ్యవసాయ పద్ధతులు పాటించే రైతులకు ఎకరానికి 1,500 నుండి 4,000 రూపాయల వరకు నేరుగా బ్యాంక్ ఖాతాలో లభిస్తాయి. 70 శాతం నగదు దళారులు లేకుండా నేరుగా మీ ఖాతాలో జమ అవుతుంది.",
    listenBtn: "వినండి 🔊",
    heroTitle1: "వ్యవసాయం ద్వారా కార్బన్ సంపాదించండి,",
    heroTitle2: "నేరుగా బ్యాంక్ ఖాతాలో డబ్బు పొందండి.",
    heroDesc: "కొయ్యలు కాల్చకుండా, జీరో టిల్లేజ్ మరియు సేంద్రీయ ఎరువులు వాడే రైతులకు ఎకరానికి ₹1,500 నుండి ₹4,000 అదనపు ఆదాయం. 70% ప్రత్యక్ష DBT చెల్లింపు.",
    passbookBtn: "📱 రైతు పాస్‌బుక్",
    procureBtn: "కార్బన్ కొనుగోలు",
    fpoBtn: "FPO విస్తరణ",
    tonsLabel: "ధృవీకరించిన కార్బన్",
    tonsUnit: "టన్నుల CO₂e",
    payoutsLabel: "ప్రత్యక్ష బ్యాంక్ బదిలీ (DBT)",
    farmersLabel: "నమోదైన రైతులు",
    cardSys: "పారదర్శక రైతు వ్యవస్థ",
    cardSys100: "100% స్థానిక",
    card1Title: "70% రైతుకు ప్రత్యక్ష వాటా",
    card1Sub: "ప్రతి క్రెడిట్ నుండి 70% నేరుగా రైతు ఖాతాలోకి",
    card2Title: "కాగితపు పనులు లేవు",
    card2Sub: "సాధారణ మొబైల్‌తో ఫోటో తీస్తే సరిపోతుంది",
    card3Title: "3 విడతల్లో ప్రత్యక్ష DBT",
    card3Sub: "20% నమోదులో, 40% పంట మధ్యలో, 40% కోత తర్వాత",
    helpline: "టోల్-ఫ్రీ హెల్ప్‌లైన్: 1800-227-266 (ఉచిత సహాయం)",
    guideTag: "🌾 రైతు మార్గదర్శి",
    stepsTitle: "సులభమైన 3 దశలు: పొలం నుండి నేరుగా ఆదాయం",
    stepsSub: "దళారులు లేకుండా, మంచి వ్యవసాయం చేసి 70% నగదు నేరుగా బ్యాంక్ ఖాతాలో పొందండి.",
    stepsAudio: "రైతు సోదరుల కోసం 3 సులభమైన దశలు. 1: కొయ్యలు కాల్చవద్దు, జీరో టిల్లేజ్ చేయండి. 2: మొబైల్‌తో ఫోటో పంపండి. 3: 70% నగదు నేరుగా బ్యాంక్‌లో పొందండి.",
    stepAudioBtn: "3 దశలు వినండి 🔊",
    step01Badge: "దశ 01",
    step01Title: "1. మంచి పద్ధతులు పాటించండి",
    step01Desc: "కొయ్యలు కాల్చవద్దు, జీరో టిల్లేజ్ లేదా సేంద్రీయ బయోచార్ వాడండి. నేలలో తేమ పెరుగుతుంది.",
    step01Rate: "₹1,500 - ₹4,000 / ఎకరం",
    step01Audio: "దశ 1: కొయ్యలు కాల్చకుండా జీరో టిల్లేజ్ చేయండి.",
    step02Badge: "దశ 02",
    step02Title: "2. మొబైల్ నుండి ఫోటో పంపండి",
    step02Desc: "కాగితాల గొడవ లేదు. ఫోన్‌తో పొలం ఫోటో తీయండి, స్థానం ఆటోమేటిక్‌గా నమోదవుతుంది.",
    step02Rate: "100% డిజిటల్ & సులభం",
    step02Audio: "దశ 2: ఫోన్‌తో ఫోటో తీయండి.",
    step03Badge: "దశ 03",
    step03Title: "3. బ్యాంక్‌లో నేరుగా నగదు",
    step03Desc: "క్రెడిట్ అమ్మినప్పుడు 70% నగదు నేరుగా మీ ఆధార్ లింక్డ్ బ్యాంక్ ఖాతాలో జమ అవుతుంది.",
    step03Rate: "70% DBT హామీ",
    step03Audio: "దశ 3: 70% నగదు నేరుగా ఖాతాలో జమ అవుతుంది.",
    farmersTitle: "నిజమైన రైతులు — ప్రత్యక్ష బ్యాంక్ బదిలీలు",
    farmersSub: "ఆంధ్రప్రదేశ్ మరియు ఇతర రాష్ట్రాల రైతులు నేరుగా లబ్ధి పొందారు",
    bankReceived: "బ్యాంక్‌లో జమ",
    simTag: "Interactive Platform Simulator",
    simTitle: "రైతు, FPO లేదా ఫ్యాక్టరీ పాత్రలో చూడండి",
    simSub: "పాత్ర మార్చి భూమి వివరాలు లేదా కొనుగోలు చూడండి.",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% ప్రత్యక్ష చెల్లింపు చిన్న రైతులకు",
    splitDesc: "దళారులు ఎక్కువ కమీషన్ తీసుకుంటారు. కార్బన్‌ఖేతిలో 70% ఆదాయం నేరుగా రైతుకు అందుతుంది.",
    splitNotice: "చెల్లింపులు 3 విడతల్లో: 20% నమోదులో, 40% పంట మధ్యలో, 40% కోత తర్వాత.",
    splitCol1: "రైతు వాటా",
    splitCol1Sub: "ప్రత్యక్ష UPI / బ్యాంక్ ఖాతా",
    splitCol2: "FPO నిర్వహణ",
    splitCol2Sub: "విస్తరణ మరియు సాంకేతికత",
    splitCol3: "స్వతంత్ర ఆడిట్",
    splitCol3Sub: "శాటిలైట్ తనిఖీ",
    splitCol4: "రిస్క్ బఫర్",
    splitCol4Sub: "వాతావరణ రక్షణ",
  },
  kn: {
    badge: "ಭಾರತ ಸರ್ಕಾರ CCTS • ರೈತ ಕಾರ್ಬನ್ ವಿನಿಮಯ",
    heroAudio: "ಕಾರ್ಬನ್‌ಖೇತಿಗೆ ಸ್ವಾಗತ. ಉತ್ತಮ ಕೃಷಿ ಪದ್ಧತಿ ಅನುಸರಿಸುವ ರೈತರಿಗೆ ಎಕರೆಗೆ 1,500 ರಿಂದ 4,000 ರೂ. ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಸಿಗುತ್ತದೆ. 70% ಹಣ ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ನಿಮ್ಮ ಖಾತೆಗೆ ಬರುತ್ತದೆ.",
    listenBtn: "ಆಡಿಯೋ ಆಲಿಸಿ 🔊",
    heroTitle1: "ಕೃಷಿಯಿಂದ ಕಾರ್ಬನ್ ಗಳಿಸಿ,",
    heroTitle2: "ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ಪಡೆಯಿರಿ.",
    heroDesc: "ಬೆಳೆ ತ್ಯಾಜ್ಯ ಸುಡದಿರುವ, ಶೂನ್ಯ ಉಳುಮೆ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸುವ ರೈತರಿಗೆ ಎಕರೆಗೆ ₹1,500 ರಿಂದ ₹4,000 ವಾರ್ಷಿಕ ಆದಾಯ. 70% ನೇರ ಬ್ಯಾಂಕ್ ಪಾವತಿ.",
    passbookBtn: "📱 ರೈತ ಪಾಸ್‌ಬುಕ್",
    procureBtn: "ಕಾರ್ಬನ್ ಖರೀದಿ",
    fpoBtn: "FPO ವಿಸ್ತರಣೆ",
    tonsLabel: "ಪ್ರಮಾಣೀಕೃತ ಕಾರ್ಬನ್",
    tonsUnit: "ಟನ್ CO₂e",
    payoutsLabel: "ನೇರ ಬ್ಯಾಂಕ್ ಪಾವತಿ (DBT)",
    farmersLabel: "ನೋಂದಾಯಿತ ರೈತರು",
    cardSys: "ಪಾರದರ್ಶಕ ರೈತ ವ್ಯವಸ್ಥೆ",
    cardSys100: "100% ಸ್ಥಳೀಯ",
    card1Title: "70% ನೇರ ರೈತ ಪಾಲು",
    card1Sub: "ಪ್ರತಿ ಕ್ರೆಡಿಟ್‌ನ 70% ಹಣ ನೇರವಾಗಿ ರೈತನ ಖಾತೆಗೆ",
    card2Title: "ಕಾಗದಪತ್ರಗಳ ಅಗತ್ಯವಿಲ್ಲ",
    card2Sub: "ಸಾಧಾರಣ ಫೋನ್‌ನಲ್ಲಿ ಹೊಲದ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    card3Title: "3 ಕಂತುಗಳಲ್ಲಿ ನೇರ DBT",
    card3Sub: "20% ನೋಂದಣಿಯಲ್ಲಿ, 40% ಬೆಳೆ ನಡುವೆ, 40% ಕೊಯ್ಲಿನ ನಂತರ",
    helpline: "ಟೋಲ್-ಫ್ರೀ ಸಹಾಯವಾಣಿ: 1800-227-266 (ಉಚಿತ ಸಹಾಯ)",
    guideTag: "🌾 ರೈತ ಮಾರ್ಗದರ್ಶಿ",
    stepsTitle: "ಸುಲಭ 3 ಹಂತಗಳು: ಕೃಷಿಯಿಂದ ನೇರ ಆದಾಯ",
    stepsSub: "ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ, ಉತ್ತಮ ಕೃಷಿಗೆ 70% ನಗದು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪಡೆಯಿರಿ.",
    stepsAudio: "ರೈತ ಬಾಂಧವರಿಗೆ 3 ಸುಲಭ ಹಂತಗಳು. 1: ಕಳೆ ಸುಡಬೇಡಿ, ಶೂನ್ಯ ಉಳುಮೆ ಮಾಡಿ. 2: ಮೊಬೈಲ್‌ನಿಂದ ಫೋಟೋ ಕಳುಹಿಸಿ. 3: 70% ಹಣವನ್ನು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ.",
    stepAudioBtn: "3 ಹಂತಗಳನ್ನು ಆಲಿಸಿ 🔊",
    step01Badge: "ಹಂತ 01",
    step01Title: "1. ಉತ್ತಮ ಪದ್ಧತಿ ಅನುಸರಿಸಿ",
    step01Desc: "ಬೆಳೆ ತ್ಯಾಜ್ಯ ಸುಡಬೇಡಿ, ಶೂನ್ಯ ಉಳುಮೆ ಅಥವಾ ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ. ಮಣ್ಣಿನ ತೇವಾಂಶ ಹೆಚ್ಚುತ್ತದೆ.",
    step01Rate: "₹1,500 - ₹4,000 / ಎಕರೆ",
    step01Audio: "ಹಂತ 1: ಬೆಳೆ ತ್ಯಾಜ್ಯ ಸುಡದೆ ಶೂನ್ಯ ಉಳುಮೆ ಮಾಡಿ.",
    step02Badge: "ಹಂತ 02",
    step02Title: "2. ಮೊಬೈಲ್‌ನಿಂದ ಫೋಟೋ ಕಳುಹಿಸಿ",
    step02Desc: "ಕಾಗದಪತ್ರಗಳ ಗೋಜಿಲ್ಲ. ಫೋನ್‌ನಲ್ಲಿ ಫೋಟೋ ತೆಗೆಯಿರಿ, ಸ್ಥಳ ತಾನಾಗಿಯೇ ದಾಖಲಾಗುತ್ತದೆ.",
    step02Rate: "100% ಡಿಜಿಟಲ್ & ಸುಲಭ",
    step02Audio: "ಹಂತ 2: ಮೊಬೈಲ್‌ನಲ್ಲಿ ಫೋಟೋ ತೆಗೆಯಿರಿ.",
    step03Badge: "ಹಂತ 03",
    step03Title: "3. ನೇರ ಬ್ಯಾಂಕ್ ಪಾವತಿ",
    step03Desc: "ಕ್ರೆಡಿಟ್ ಮಾರಾಟವಾದಾಗ 70% ಹಣ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.",
    step03Rate: "70% DBT ಗ್ಯಾರಂಟಿ",
    step03Audio: "ಹಂತ 3: 70% ಹಣ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ.",
    farmersTitle: "ನೈಜ ರೈತರು — ನೇರ ಬ್ಯಾಂಕ್ ಜಮೆ",
    farmersSub: "ಕರ್ನಾಟಕ ಮತ್ತು ಇತರ ರಾಜ್ಯಗಳ ರೈತರು ನೇರ ಲಾಭ ಪಡೆದಿದ್ದಾರೆ",
    bankReceived: "ಬ್ಯಾಂಕ್‌ಗೆ ಜಮೆ",
    simTag: "Interactive Platform Simulator",
    simTitle: "ರೈತ, FPO ಅಥವಾ ಕಂಪನಿ ಪಾತ್ರದಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
    simSub: "ಪಾತ್ರ ಬದಲಾಯಿಸಿ ಕೃಷಿ ಲೆಕ್ಕಾಚಾರ ಅಥವಾ ಖರೀದಿ ನೋಡಿ.",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% ನೇರ ಪಾವತಿ ಸಣ್ಣ ರೈತರಿಗೆ",
    splitDesc: "ಮಧ್ಯವರ್ತಿಗಳು ಅಧಿಕ ಕಮಿಷನ್ ಪಡೆಯುತ್ತಾರೆ. ಕಾರ್ಬನ್‌ಖೇತಿಯಲ್ಲಿ 70% ನೇರವಾಗಿ ರೈತರಿಗೆ ಸಿಗುತ್ತದೆ.",
    splitNotice: "3 ಕಂತುಗಳಲ್ಲಿ ಹಣ: 20% ನೋಂದಣಿಯಲ್ಲಿ, 40% ಬೆಳೆ ನಡುವೆ, 40% ಕೊಯ್ಲಿನ ನಂತರ.",
    splitCol1: "ರೈತನ ಪಾಲು",
    splitCol1Sub: "ನೇರ UPI / ಬ್ಯಾಂಕ್ ಖಾತೆ",
    splitCol2: "FPO ಕಾರ್ಯಾಚರಣೆ",
    splitCol2Sub: "ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ವಿಸ್ತರಣೆ",
    splitCol3: "ಸ್ವತಂತ್ರ ಆಡಿಟ್",
    splitCol3Sub: "ಉಪಗ್ರಹ ತಪಾಸಣೆ",
    splitCol4: "ಭದ್ರತಾ ಬಫರ್",
    splitCol4Sub: "ಹವಾಮಾನ ರಕ್ಷಣೆ",
  },
  bn: {
    badge: "ভারত সরকার CCTS • কৃষক কার্বন এক্সচেঞ্জ",
    heroAudio: "কার্বনখেতিতে আপনাকে স্বাগতম। পরিবেশবান্ধব চাষ করা কৃষকদের একর প্রতি 1,500 থেকে 4,000 টাকা সরাসরি ব্যাঙ্ক অ্যাকাউন্টে দেওয়া হয়। 70% টাকা কোনো দালাল ছাড়া সরাসরি ব্যাঙ্কে আসে।",
    listenBtn: "শুনে নিন 🔊",
    heroTitle1: "চাষ থেকে কার্বন আয় করুন,",
    heroTitle2: "সরাসরি ব্যাঙ্ক অ্যাকাউন্টে টাকা পান।",
    heroDesc: "নাড়া না পোড়ানো, জিরো টিলেজ এবং জৈব সার ব্যবহারকারী কৃষকদের জন্য একর প্রতি ₹1,500 থেকে ₹4,000 আয়। 70% সরাসরি ব্যাঙ্ক একাউন্টে (DBT)।",
    passbookBtn: "📱 কৃষক পাসবই",
    procureBtn: "কার্বন ক্রয়",
    fpoBtn: "FPO পরিষেবা",
    tonsLabel: "প্রত্যয়িত কার্বন",
    tonsUnit: "টন CO₂e",
    payoutsLabel: "সরাসরি ব্যাঙ্ক প্রদান (DBT)",
    farmersLabel: "নিবন্ধিত কৃষক",
    cardSys: "স্বচ্ছ কৃষক ব্যবস্থা",
    cardSys100: "100% স্থানীয়",
    card1Title: "70% সরাসরি কৃষকের অংশ",
    card1Sub: "প্রতিটি ক্রেডিটের 70% সরাসরি কৃষকের অ্যাকাউন্টে",
    card2Title: "কোনো কাগজের ঝামেলা নেই",
    card2Sub: "সাধারণ ফোনে জমির ছবি তুললেই যথেষ্ট",
    card3Title: "3 কিস্তিতে সরাসরি DBT",
    card3Sub: "20% নিবন্ধনে, 40% ফসলের মাঝে, 40% কাটার পর",
    helpline: "টোল-ফ্রি হেল্পলাইন: 1800-227-266 (বিনামূল্যে সহায়তা)",
    guideTag: "🌾 কৃষক নির্দেশিকা",
    stepsTitle: "সহজ ৩টি ধাপ: জমি থেকে সরাসরি আয়",
    stepsSub: "দালাল ছাড়া, ভালো চাষ করে 70% টাকা সরাসরি ব্যাঙ্ক অ্যাকাউন্টে পান।",
    stepsAudio: "কৃষক ভাইদের জন্য ৩টি সহজ ধাপ। ১: নাড়া পোড়াবেন না, জিরো টিলেজ করুন। ২: মোবাইল দিয়ে ছবি তুলুন। ৩: ৭০% টাকা সরাসরি ব্যাঙ্কে পান।",
    stepAudioBtn: "৩টি ধাপ শুনুন 🔊",
    step01Badge: "ধাপ ০১",
    step01Title: "1. ভালো পদ্ধতি গ্রহণ করুন",
    step01Desc: "নাড়া পোড়াবেন না, জিরো টিলেজ বা বায়োচার জৈব সার ব্যবহার করুন। মাটির আর্দ্রতা বজায় থাকবে।",
    step01Rate: "₹1,500 - ₹4,000 / একর",
    step01Audio: "ধাপ ১: ফসলের নাড়া পোড়াবেন না, জিরো টিলেজ করুন।",
    step02Badge: "ধাপ ০২",
    step02Title: "2. মোবাইলে ছবি পাঠান",
    step02Desc: "কাগজের ঝামেলা নেই। স্মার্টফোনে জমির ছবি তুলুন, অবস্থান স্বয়ংক্রিয়ভাবে নথিভুক্ত হবে।",
    step02Rate: "100% ডিজিটাল ও সহজ",
    step02Audio: "ধাপ ২: মোবাইল দিয়ে ছবি তুলুন।",
    step03Badge: "ধাপ ০৩",
    step03Title: "3. সরাসরি ব্যাঙ্কে টাকা",
    step03Desc: "ক্রেডিট বিক্রি হলে 70% টাকা সরাসরি আপনার অ্যাকাউন্টে DBT মারফত জমা হবে।",
    step03Rate: "70% DBT নিশ্চয়তা",
    step03Audio: "ধাপ ৩: ৭০% সম্পূর্ণ অর্থ সরাসরি অ্যাকাউন্টে আসবে।",
    farmersTitle: "বাস্তব কৃষক — সরাসরি ব্যাঙ্ক টাকা",
    farmersSub: "পশ্চিমবঙ্গ ও অন্যান্য রাজ্যের কৃষক যারা সরাসরি সুবিধা পেয়েছেন",
    bankReceived: "ব্যাঙ্কে প্রাপ্ত",
    simTag: "Interactive Platform Simulator",
    simTitle: "কৃষক, FPO বা কোম্পানি ভূমিকায় দেখুন",
    simSub: "ভূমিকা পরিবর্তন করে জমির হিসাব বা সিমুলেশন দেখুন।",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% সরাসরি কৃষকের অংশ",
    splitDesc: "দালালরা কমিশন কাটে। কার্বনখেতিতে 70% সরাসরি কৃষকের ব্যাঙ্ক অ্যাকাউন্টে জমা হয়।",
    splitNotice: "টাকা ৩টি কিস্তিতে: ২০% নিবন্ধনে, ৪০% ফসলের মাঝে, ৪০% কাটার পর।",
    splitCol1: "কৃষকের অংশ",
    splitCol1Sub: "সরাসরি UPI / ব্যাঙ্ক অ্যাকাউন্ট",
    splitCol2: "FPO পরিচালনা",
    splitCol2Sub: "প্রযুক্তি ও বিস্তার",
    splitCol3: "স্বাধীন নিরীক্ষা",
    splitCol3Sub: "স্যাটেলাইট পর্যবেক্ষণ",
    splitCol4: "ঝুঁকি বাফার",
    splitCol4Sub: "আবহাওয়া সুরক্ষা",
  },
  od: {
    badge: "ଭାରତ ସରକାର CCTS • କୃଷକ କାର୍ବନ ଏକ୍ସଚେଞ୍ଜ",
    heroAudio: "କାର୍ବନଖେତିକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ଉତ୍ତମ ଚାଷ କରୁଥିବା ଚାଷୀ ଭାଇମାନଙ୍କୁ ଏକର ପିଛା 1,500 ରୁ 4,000 ଟଙ୍କା ସିଧା ବ୍ୟାଙ୍କ ଖାତାରେ ମିଳେ। 70 ପ୍ରତିଶତ ଟଙ୍କା କୌଣସି ଦଲାଲ ବିନା ସିଧା ବ୍ୟାଙ୍କକୁ ଆସେ।",
    listenBtn: "ଶୁଣନ୍ତୁ 🔊",
    heroTitle1: "ଚାଷରୁ କାର୍ବନ ରୋଜଗାର କରନ୍ତୁ,",
    heroTitle2: "ସିଧା ବ୍ୟାଙ୍କ ଖାତାରେ ଟଙ୍କା ପାଆନ୍ତୁ।",
    heroDesc: "ନଡ଼ା ନ ପୋଡ଼ିବା, ଶୂନ୍ୟ ଚାଷ ଏବଂ ଜୈବିକ ଖତ ବ୍ୟବହାରକାରୀ ଚାଷୀଙ୍କ ପାଇଁ ଏକର ପିଛା ₹1,500 ରୁ ₹4,000 ରୋଜଗାର। 70% ସିଧା ବ୍ୟାଙ୍କ ଖାତାକୁ (DBT)।",
    passbookBtn: "📱 କୃଷକ ପାସବୁକ୍",
    procureBtn: "କାର୍ବନ କ୍ରୟ",
    fpoBtn: "FPO ସେବା",
    tonsLabel: "ପ୍ରମାଣିତ କାର୍ବନ",
    tonsUnit: "ଟନ୍ CO₂e",
    payoutsLabel: "ସିଧା ବ୍ୟାଙ୍କ ପାଉଣା (DBT)",
    farmersLabel: "ପଞ୍ଜୀକୃତ ଚାଷୀ",
    cardSys: "ସ୍ୱଚ୍ଛ କୃଷକ ବ୍ୟବସ୍ଥା",
    cardSys100: "100% ସ୍ଥାନୀୟ",
    card1Title: "70% ସିଧା ଚାଷୀଙ୍କ ଅଂଶ",
    card1Sub: "ପ୍ରତି କ୍ରେଡିଟର 70% ସିଧା ବ୍ୟାଙ୍କ ଖାତାକୁ",
    card2Title: "କାଗଜପତ୍ରର କୌଣସି ଆବଶ୍ୟକତା ନାହିଁ",
    card2Sub: "ସାଧାରଣ ଫୋନରେ ଜମିର ଫଟୋ ଉଠାନ୍ତୁ",
    card3Title: "3 କିସ୍ତିରେ ସିଧା DBT",
    card3Sub: "20% ପଞ୍ଜୀକରଣରେ, 40% ଫସଲ ମଧ୍ୟରେ, 40% ଅମଳ ପରେ",
    helpline: "ଟୋଲ୍-ଫ୍ରି ହେଲ୍ପଲାଇନ: 1800-227-266 (ମାଗଣା ସହାୟତା)",
    guideTag: "🌾 କୃଷକ ମାର୍ଗଦର୍ଶିକା",
    stepsTitle: "ସହଜ 3 ପଦକ୍ଷେପ: ଜମିରୁ ସିଧା ଆୟ",
    stepsSub: "ଦଲାଲ ବିନା, ଉତ୍ତମ ଚାଷ କରି 70% ଟଙ୍କା ସିଧା ବ୍ୟାଙ୍କ ଖାତାରେ ପାଆନ୍ତୁ।",
    stepsAudio: "ଚାଷୀ ଭାଇଙ୍କ ପାଇଁ ୩ଟି ସହଜ ପଦକ୍ଷେପ। ୧: ନଡ଼ା ପୋଡ଼ନ୍ତୁ ନାହିଁ, ଶୂନ୍ୟ ଚାଷ କରନ୍ତୁ। ୨: ମୋବାଇଲରେ ଫଟୋ ପଠାନ୍ତୁ। ୩: ୭୦% ଟଙ୍କା ସିଧା ବ୍ୟାଙ୍କରେ ପାଆନ୍ତୁ।",
    stepAudioBtn: "୩ଟି ପଦକ୍ଷେପ ଶୁଣନ୍ତୁ 🔊",
    step01Badge: "ପଦକ୍ଷେପ ୦୧",
    step01Title: "1. ଉତ୍ତମ ପଦ୍ଧତି ଆପଣାନ୍ତୁ",
    step01Desc: "ନଡ଼ା ପୋଡ଼ନ୍ତୁ ନାହିଁ, ଶୂନ୍ୟ ଚାଷ କିମ୍ବା ବାୟୋଚାର ଖତ ବ୍ୟବହାର କରନ୍ତୁ।",
    step01Rate: "₹1,500 - ₹4,000 / ଏକର",
    step01Audio: "ପଦକ୍ଷେପ ୧: ନଡ଼ା ନ ପୋଡ଼ି ଶୂନ୍ୟ ଚାଷ କରନ୍ତୁ।",
    step02Badge: "ପଦକ୍ଷେପ ୦୨",
    step02Title: "2. ମୋବାଇଲରୁ ଫଟୋ ପଠାନ୍ତୁ",
    step02Desc: "କାଗଜପତ୍ରର ଝିଞ୍ଜଟ ନାହିଁ। ଫୋନରେ ଫଟୋ ଉଠାନ୍ତୁ, ସ୍ଥାନ ଆପେ ଆପେ ଦର୍ଜ ହୋଇଯିବ।",
    step02Rate: "100% ଡିଜିଟାଲ୍ ଓ ସହଜ",
    step02Audio: "ପଦକ୍ଷେପ ୨: ମୋବାଇଲରେ ଫଟୋ ଉଠାନ୍ତୁ।",
    step03Badge: "ପଦକ୍ଷେପ ୦୩",
    step03Title: "3. ସିଧା ବ୍ୟାଙ୍କରେ ଟଙ୍କା",
    step03Desc: "କ୍ରେଡିଟ୍ ବିକ୍ରି ହେଲେ 70% ଟଙ୍କା ସିଧା ବ୍ୟାଙ୍କ ଖାତାକୁ DBT ଜରିଆରେ ଆସିବ।",
    step03Rate: "70% DBT ଗ୍ୟାରେଣ୍ଟି",
    step03Audio: "ପଦକ୍ଷେପ ୩: ୭୦% ପୂରା ଟଙ୍କା ସିଧା ବ୍ୟାଙ୍କକୁ ଆସିବ।",
    farmersTitle: "ବାସ୍ତବ ଚାଷୀ — ସିଧା ବ୍ୟାଙ୍କ ପାଉଣା",
    farmersSub: "ଓଡ଼ିଶା ଓ ଅନ୍ୟ ରାଜ୍ୟର ଚାଷୀ ଯେଉଁମାନେ ସିଧା ଲାଭ ପାଇଛନ୍ତି",
    bankReceived: "ବ୍ୟାଙ୍କରେ ଜମା",
    simTag: "Interactive Platform Simulator",
    simTitle: "ଚାଷୀ, FPO ବା କମ୍ପାନୀ ଭୂମିକାରେ ଦେଖନ୍ତୁ",
    simSub: "ଭୂମିକା ପରିବର୍ତ୍ତନ କରି ଜମି ହିସାବ ବା କ୍ରୟ ଦେଖନ୍ତୁ।",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% ସିଧା ପାଉଣା କ୍ଷୁଦ୍ର ଚାଷୀଙ୍କୁ",
    splitDesc: "ଦଲାଲମାନେ ଅଧିକ କମିଶନ ନିଅନ୍ତି। କାର୍ବନଖେତିରେ 70% ସିଧା ଚାଷୀଙ୍କ ଖାତାକୁ ଯାଏ।",
    splitNotice: "3 କିସ୍ତିରେ ଟଙ୍କା: 20% ପଞ୍ଜୀକରଣରେ, 40% ଫସଲ ମଝିରେ, 40% ଅମଳ ପରେ।",
    splitCol1: "ଚାଷୀଙ୍କ ଅଂଶ",
    splitCol1Sub: "ସିଧା UPI / ବ୍ୟାଙ୍କ ଖାତା",
    splitCol2: "FPO ପରିଚାଳନା",
    splitCol2Sub: "ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ଓ ସହାୟତା",
    splitCol3: "ସ୍ୱତନ୍ତ୍ର ଅଡିଟ",
    splitCol3Sub: "ଉପଗ୍ରହ ନିରୀକ୍ଷଣ",
    splitCol4: "ସୁରକ୍ଷା ବଫର",
    splitCol4Sub: "ପାଣିପାଗ ସୁରକ୍ଷା",
  },
  ml: {
    badge: "ഭാരത സർക്കാർ CCTS • കർഷക കാർബൺ എക്സ്ചേഞ്ച്",
    heroAudio: "കാർബൺഖേതിയിലേക്ക് സ്വാഗതം. പരിസ്ഥിതി സൗഹൃദ കൃഷി ചെയ്യുന്ന കർഷകർക്ക് ഏക്കറിന് 1,500 മുതൽ 4,000 രൂപ വരെ നേരിട്ട് ബാങ്കിൽ ലഭിക്കുന്നു. 70 ശതമാനം തുക ഇടനിലക്കാരില്ലാതെ ബാങ്കിലെത്തുന്നു.",
    listenBtn: "ശ്രദ്ധിക്കൂ 🔊",
    heroTitle1: "കൃഷിയിലൂടെ കാർബൺ സമ്പാദിക്കൂ,",
    heroTitle2: "നേരിട്ട് ബാങ്ക് അക്കൗണ്ടിൽ പണം നേടൂ.",
    heroDesc: "വൈക്കോൽ കത്തിക്കാതിരിക്കൽ, സീറോ ടില്ലേജ്, ജൈവവളം എന്നിവ ഉപയോഗിക്കുന്ന കർഷകർക്ക് ഏക്കറിന് ₹1,500 മുതൽ ₹4,000 വരെ വരുമാനം. 70% നേരിട്ട് ബാങ്കിലേക്ക്.",
    passbookBtn: "📱 കർഷക പാസ്ബുക്ക്",
    procureBtn: "കാർബൺ വാങ്ങൽ",
    fpoBtn: "FPO സേവന കേന്ദ്രം",
    tonsLabel: "സാക്ഷ്യപ്പെടുത്തിയ കാർബൺ",
    tonsUnit: "ടൺ CO₂e",
    payoutsLabel: "നേരിട്ടുള്ള ബാങ്ക് പേയ്മെന്റ് (DBT)",
    farmersLabel: "രജിസ്റ്റർ ചെയ്ത കർഷകർ",
    cardSys: "സുതാര്യമായ കർഷക സംവിധാനം",
    cardSys100: "100% പ്രാദേശികം",
    card1Title: "70% കർഷകന് നേരിട്ട്",
    card1Sub: "ഓരോ ക്രെഡിറ്റിന്റെയും 70% ബാങ്കിലേക്ക് നേരിട്ടെത്തുന്നു",
    card2Title: "രേഖകളുടെ ആവശ്യമില്ല",
    card2Sub: "മൊബൈലിൽ കൃഷിയിടത്തിന്റെ ഫോട്ടോ എടുത്താൽ മതി",
    card3Title: "3 ഗഡുക്കളായി നേരിട്ട് DBT",
    card3Sub: "20% രജിസ്ട്രേഷനിൽ, 40% വിളയ്ക്കിടയിൽ, 40% വിളവെടുപ്പിന് ശേഷം",
    helpline: "ടോൾ-ഫ്രീ ഹെൽപ്പ്‌ലൈൻ: 1800-227-266 (സൗജന്യ സഹായം)",
    guideTag: "🌾 കർഷക വഴികാട്ടി",
    stepsTitle: "ലളിതമായ 3 ഘട്ടങ്ങൾ: കൃഷിയിൽ നിന്ന് നേരിട്ടുള്ള വരുമാനം",
    stepsSub: "ഇടനിലക്കാരില്ലാതെ, നല്ല കൃഷിരീതികൾ വഴി 70% പണം നേരിട്ട് ബാങ്ക് അക്കൗണ്ടിൽ നേടൂ.",
    stepsAudio: "കർഷകർക്കായി 3 ലളിതമായ ഘട്ടങ്ങൾ. 1: വൈക്കോൽ കത്തിക്കരുത്, സീറോ ടില്ലേജ് ചെയ്യുക. 2: മൊബൈലിൽ ഫോട്ടോ എടുക്കുക. 3: 70% പണം നേരിട്ട് ബാങ്കിൽ നേടുക.",
    stepAudioBtn: "3 ഘട്ടങ്ങൾ കേൾക്കൂ 🔊",
    step01Badge: "ഘട്ടം 01",
    step01Title: "1. മികച്ച രീതികൾ സ്വീകരിക്കുക",
    step01Desc: "വൈക്കോൽ കത്തിക്കാതെ സീറോ ടില്ലേജ് അല്ലെങ്കിൽ ബയോചാർ ഉപയോഗിക്കുക. മണ്ണിലെ ഈർപ്പം നിലനിൽക്കും.",
    step01Rate: "₹1,500 - ₹4,000 / ഏക്കർ",
    step01Audio: "ഘട്ടം 1: വൈക്കോൽ കത്തിക്കാതെ സീറോ ടില്ലേജ് ചെയ്യുക.",
    step02Badge: "ഘട്ടം 02",
    step02Title: "2. മൊബൈലിൽ ഫോട്ടോ എടുക്കുക",
    step02Desc: "രേഖകളുടെ ആവശ്യമില്ല. ഫോണിൽ ഫോട്ടോ എടുക്കുക, സ്ഥലം തനിയെ രേഖപ്പെടുത്തും.",
    step02Rate: "100% ഡിജിറ്റലും എളുപ്പവും",
    step02Audio: "ഘട്ടം 2: മൊബൈലിൽ ഫോട്ടോ എടുക്കുക.",
    step03Badge: "ഘട്ടം 03",
    step03Title: "3. ബാങ്കിലേക്ക് നേരിട്ട് പണം",
    step03Desc: "ക്രെഡിറ്റ് വിൽക്കുമ്പോൾ 70% തുക നേരിട്ട് നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ടിലേക്ക് എത്തും.",
    step03Rate: "70% DBT ഉറപ്പ്",
    step03Audio: "ഘട്ടം 3: 70% മുഴുവൻ തുകയും ബാങ്കിലേക്ക് നേരിട്ടെത്തും.",
    farmersTitle: "യഥാർത്ഥ കർഷകർ — നേരിട്ടുള്ള ബാങ്ക് വരുമാനം",
    farmersSub: "കേരളത്തിലും മറ്റ് സംസ്ഥാനങ്ങളിലുമുള്ള കർഷകർ നേരിട്ട് നേട്ടം കൈവരിച്ചു",
    bankReceived: "ബാങ്കിൽ ലഭിച്ചു",
    simTag: "Interactive Platform Simulator",
    simTitle: "കർഷകൻ, FPO അല്ലെങ്കിൽ ഫാക്ടറി റോളിൽ കാണുക",
    simSub: "റോൾ മാറ്റി കൃഷി കണക്കുകൾ അല്ലെങ്കിൽ വാങ്ങൽ പരിശോധിക്കൂ.",
    splitTag: "Guaranteed Split Economics",
    splitTitle: "70% നേരിട്ടുള്ള പേയ്മെന്റ് ചെറുകിട കർഷകർക്ക്",
    splitDesc: "ഇടനിലക്കാർ വൻ തുക പിടിക്കുന്നു. കാർബൺഖേതിയിൽ 70% വരുമാനം നേരിട്ട് കർഷകന്റെ ബാങ്കിലെത്തുന്നു.",
    splitNotice: "3 ഗഡുക്കളായി പണം: 20% രജിസ്ട്രേഷനിൽ, 40% വിളയ്ക്കിടയിൽ, 40% വിളവെടുപ്പിന് ശേഷം.",
    splitCol1: "കർഷക വിഹിതം",
    splitCol1Sub: "നേരിട്ടുള്ള UPI / ബാങ്ക് അക്കൗണ്ട്",
    splitCol2: "FPO പ്രവർത്തനം",
    splitCol2Sub: "സാങ്കേതികവിദ്യയും സഹായവും",
    splitCol3: "സ്വതന്ത്ര ഓഡിറ്റ്",
    splitCol3Sub: "ഉപഗ്രഹ പരിശോധന",
    splitCol4: "സുരക്ഷാ കരുതൽ",
    splitCol4Sub: "കാലാവസ്ഥാ സുരക്ഷ",
  },
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const lt = LANDING_TEXTS[locale] || LANDING_TEXTS["en"];

  const stats = dataStore.getStats();
  const config = dataStore.getConfig();

  return (
    <div className="flex-1 flex flex-col bg-[#FAFAF9] text-stone-900">
      {/* Clean, Fast, Aesthetic Minimalist Hero */}
      <section className="bg-white border-b border-stone-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Cols: Plain-Language High-Impact Guidance */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200">
                  <span className="w-2 h-2 rounded-full bg-stone-900" />
                  <span>{lt.badge}</span>
                </span>
                <VoiceButton
                  textToSpeak={lt.heroAudio}
                  label={lt.listenBtn}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs py-1 px-3"
                />
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.12]">
                {lt.heroTitle1}
                <span className="block text-stone-700 mt-1 sm:mt-2">
                  {lt.heroTitle2}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                {lt.heroDesc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/${locale}/farmer`}
                  className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-xs"
                >
                  <span>{lt.passbookBtn}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/factory`}
                  className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs sm:text-sm font-semibold px-5 py-3.5 rounded-xl transition-all"
                >
                  <span>{lt.procureBtn}</span>
                </Link>
                <Link
                  href={`/${locale}/agent`}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium px-4 py-3.5 rounded-xl transition-all"
                >
                  <span>{lt.fpoBtn}</span>
                </Link>
              </div>

              {/* Direct Statistics Ribbon */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[11px] text-stone-500 font-medium">{lt.tonsLabel}</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-0.5">
                    {stats.tonsCredited.toLocaleString("en-IN")} <span className="text-xs text-stone-500 font-sans">{lt.tonsUnit}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-500 font-medium">{lt.payoutsLabel}</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-0.5">
                    ₹{stats.payoutsReleasedInr.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-500 font-medium">{lt.farmersLabel}</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-0.5">
                    {stats.farmersEnrolled.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Clean, Fast Graphic Card */}
            <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-6 sm:p-7 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                  {lt.cardSys}
                </span>
                <span className="text-[11px] font-semibold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                  {lt.cardSys100}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{lt.card1Title}</div>
                    <div className="text-[11px] text-stone-500">{lt.card1Sub}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                  <span className="text-2xl">📸</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{lt.card2Title}</div>
                    <div className="text-[11px] text-stone-500">{lt.card2Sub}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200">
                  <span className="text-2xl">🏦</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{lt.card3Title}</div>
                    <div className="text-[11px] text-stone-500">{lt.card3Sub}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-stone-500">
                {lt.helpline}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Minimal Telemetry Stream */}
      <LiveTelemetryTicker />

      {/* 🌾 LOCAL PERSON & FARMER HUB: 3 SIMPLE STEPS & LIVE EARNING CALCULATOR */}
      <section className="py-16 bg-[#F5F5F4] text-stone-900 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header with Audio Playback */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-bold">
              <span>{lt.guideTag}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
              {lt.stepsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {lt.stepsSub}
            </p>
            <div className="pt-1 flex justify-center">
              <VoiceButton
                textToSpeak={lt.stepsAudio}
                label={lt.stepAudioBtn}
                className="bg-stone-900 hover:bg-black text-white font-bold px-4 py-2 text-xs shadow-xs"
              />
            </div>
          </div>

          {/* 3 Step Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl font-bold">
                    🚜
                  </div>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {lt.step01Badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {lt.step01Title}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {lt.step01Desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-800">{lt.step01Rate}</span>
                <VoiceButton
                  textToSpeak={lt.step01Audio}
                  iconOnly={true}
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl font-bold">
                    📸
                  </div>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {lt.step02Badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {lt.step02Title}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {lt.step02Desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-800">{lt.step02Rate}</span>
                <VoiceButton
                  textToSpeak={lt.step02Audio}
                  iconOnly={true}
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center text-xl font-bold">
                    💰
                  </div>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {lt.step03Badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {lt.step03Title}
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {lt.step03Desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-800">{lt.step03Rate}</span>
                <VoiceButton
                  textToSpeak={lt.step03Audio}
                  iconOnly={true}
                />
              </div>
            </div>
          </div>

          {/* Integrated Interactive Farmer Earning Calculator */}
          <FarmerEarningCalculator locale={locale} />

          {/* Real Verified Local Farmer Evidence */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {lt.farmersTitle}
                </h3>
                <p className="text-xs text-stone-500">
                  {lt.farmersSub}
                </p>
              </div>
              <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                <span>📞 1800-227-266</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Farmer 1 */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-900 font-bold flex items-center justify-center text-xs">
                    RP
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">Ramesh Pawar</div>
                    <div className="text-[11px] text-stone-500">Yavatmal, Maharashtra (3.5 ac)</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-200">
                  <span className="text-stone-500">Zero Tillage</span>
                  <span className="font-bold font-mono text-stone-900">₹14,500 {lt.bankReceived}</span>
                </div>
              </div>

              {/* Farmer 2 */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-900 font-bold flex items-center justify-center text-xs">
                    GS
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">Gurpreet Singh</div>
                    <div className="text-[11px] text-stone-500">Ludhiana, Punjab (5.0 ac)</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-200">
                  <span className="text-stone-500">Stubble Management</span>
                  <span className="font-bold font-mono text-stone-900">₹21,000 {lt.bankReceived}</span>
                </div>
              </div>

              {/* Farmer 3 */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-900 font-bold flex items-center justify-center text-xs">
                    SP
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-900">Savitaben Patel</div>
                    <div className="text-[11px] text-stone-500">Anand, Gujarat (2.0 ac)</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-200">
                  <span className="text-stone-500">Biochar & Manure</span>
                  <span className="font-bold font-mono text-stone-900">₹9,800 {lt.bankReceived}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Interactive Ecosystem Console (Clean Neutral Section) */}
      <section className="py-16 bg-white text-stone-900 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="badge-pill bg-stone-100 text-stone-800 border border-stone-200">
              {lt.simTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-2">
              {lt.simTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {lt.simSub}
            </p>
          </div>

          <DynamicEcosystemConsole locale={locale} />
        </div>
      </section>

      {/* Transparent Economic Model (Clean Neutral Aesthetic) */}
      <section className="py-16 bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="badge-pill bg-stone-800 text-stone-200 border border-stone-700">
                {lt.splitTag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {lt.splitTitle}
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                {lt.splitDesc}
              </p>
              <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300">
                {lt.splitNotice}
              </div>
            </div>

            <div className="lg:col-span-7 bg-stone-800/60 rounded-2xl p-6 sm:p-7 border border-stone-700 space-y-5">
              {/* Minimal Split Bar without green/purple/blue */}
              <div className="h-3 w-full rounded-full overflow-hidden flex bg-stone-700">
                <div style={{ width: `${config.farmerSplitPct}%` }} className="bg-white h-full" title="Farmer Share (70%)" />
                <div style={{ width: `${config.platformSplitPct}%` }} className="bg-stone-400 h-full" title="FPO / Tech (15%)" />
                <div style={{ width: `${config.verificationSplitPct}%` }} className="bg-stone-500 h-full" title="Audits (10%)" />
                <div style={{ width: `${config.bufferSplitPct}%` }} className="bg-stone-600 h-full" title="Buffer Reserve (5%)" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                <div>
                  <div className="text-2xl font-bold font-mono text-white">{config.farmerSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-0.5">{lt.splitCol1}</div>
                  <div className="text-[10px] text-stone-400">{lt.splitCol1Sub}</div>
                </div>

                <div>
                  <div className="text-2xl font-bold font-mono text-stone-300">{config.platformSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-0.5">{lt.splitCol2}</div>
                  <div className="text-[10px] text-stone-400">{lt.splitCol2Sub}</div>
                </div>

                <div>
                  <div className="text-2xl font-bold font-mono text-stone-400">{config.verificationSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-0.5">{lt.splitCol3}</div>
                  <div className="text-[10px] text-stone-400">{lt.splitCol3Sub}</div>
                </div>

                <div>
                  <div className="text-2xl font-bold font-mono text-stone-400">{config.bufferSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-0.5">{lt.splitCol4}</div>
                  <div className="text-[10px] text-stone-400">{lt.splitCol4Sub}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic CCTS Approved Methodologies Explorer */}
      <section className="py-16 bg-white text-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DynamicMethodologyExplorer />
        </div>
      </section>
    </div>
  );
}
