"use client";

import { useState } from "react";
import VoiceButton from "./VoiceButton";
import Link from "next/link";

interface PracticeOption {
  id: string;
  ratePerAcre: number;
  carbonTonsPerAcre: number;
  icon: string;
}

const PRACTICES: PracticeOption[] = [
  { id: "stubble", ratePerAcre: 2800, carbonTonsPerAcre: 2.2, icon: "🌾" },
  { id: "notill", ratePerAcre: 3400, carbonTonsPerAcre: 2.7, icon: "🚜" },
  { id: "biochar", ratePerAcre: 4200, carbonTonsPerAcre: 3.3, icon: "🌱" },
  { id: "agroforestry", ratePerAcre: 3800, carbonTonsPerAcre: 3.0, icon: "🌳" },
];

interface CalcTranslations {
  badge: string;
  title: string;
  subtitle: string;
  listenBtn: string;
  q1: string;
  acresUnit: string;
  smallFarmer: string;
  q2: string;
  rateLabel: string;
  annualEarning: string;
  perYear: string;
  carbonSink: string;
  payoutSchedule: string;
  stage1: string;
  stage1Sub: string;
  stage2: string;
  stage2Sub: string;
  stage3: string;
  stage3Sub: string;
  passbookTitle: string;
  passbookSub: string;
  passbookBtn: string;
  practiceData: Record<
    string,
    { title: string; badge: string; desc: string }
  >;
  getAudioText: (acres: number, practiceTitle: string, total: number, s1: number, s2: number, s3: number) => string;
}

const TRANSLATIONS: Record<string, CalcTranslations> = {
  en: {
    badge: "🌾 Farmer Earnings Calculator",
    title: "Calculate Your Land's Income",
    subtitle: "Select your acres, choose a practice, and see direct bank earnings.",
    listenBtn: "Listen to Calculation 🔊",
    q1: "1. How much land do you farm?",
    acresUnit: "Acres",
    smallFarmer: "1 Acre (Smallholder)",
    q2: "2. Which practice will you adopt?",
    rateLabel: "Estimated rate:",
    annualEarning: "DIRECT ANNUAL EARNING",
    perYear: "/ per year",
    carbonSink: "Estimated carbon sequestration:",
    payoutSchedule: "Payout Timeline (3 direct bank installments):",
    stage1: "1. Signup (20%)",
    stage1Sub: "Instant advance",
    stage2: "2. Mid-Crop (40%)",
    stage2Sub: "On photo check",
    stage3: "3. Harvest (40%)",
    stage3Sub: "Final transfer",
    passbookTitle: "Check Your Farmer Passbook",
    passbookSub: "Register plot, upload photos, and track incoming bank DBT",
    passbookBtn: "Open Farmer Passbook →",
    practiceData: {
      stubble: { title: "Stubble Management (No Burning)", badge: "Easiest", desc: "Incorporate crop residue with mulcher. Avoid fines and earn direct cash." },
      notill: { title: "Zero Tillage / Direct Seeding", badge: "Fuel Savings", desc: "Direct seed without deep plowing. Saves tractor diesel and preserves soil moisture." },
      biochar: { title: "Biochar & Organic Manure", badge: "Maximum Earning", desc: "Mixing organic compost improves soil fertility and yields top carbon rates." },
      agroforestry: { title: "Field Boundary Trees", badge: "Long-term Income", desc: "Plant fruit or timber trees on borders for timber, fruit, and carbon revenue." },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `Farmer friend, by adopting ${p} on your ${a} acres of land, you will earn approximately ₹${total.toLocaleString("en-IN")} per year. You will receive ₹${s1.toLocaleString("en-IN")} immediately upon enrollment, ₹${s2.toLocaleString("en-IN")} during mid-crop after photo verification, and ₹${s3.toLocaleString("en-IN")} directly in your bank account post-harvest.`,
  },
  hi: {
    badge: "🌾 किसान कमाई कैलकुलेटर",
    title: "अपनी जमीन की कमाई जानें",
    subtitle: "एकड़ चुनें, पद्धति चुनें और तुरंत देखें कि बैंक खाते में कितना पैसा आएगा।",
    listenBtn: "हिसाब बोलकर सुनें 🔊",
    q1: "1. आपके पास कितनी जमीन है?",
    acresUnit: "एकड़",
    smallFarmer: "1 एकड़ (छोटा किसान)",
    q2: "2. आप कौन सी पद्धति अपनाएंगे?",
    rateLabel: "अनुमानित दर:",
    annualEarning: "सीधी वार्षिक आय",
    perYear: "/ प्रति वर्ष",
    carbonSink: "अनुमानित कार्बन अवशोषण:",
    payoutSchedule: "पैसा मिलने का समय (3 किस्तों में सीधा बैंक खाता):",
    stage1: "1. नामांकन (20%)",
    stage1Sub: "तुरंत अग्रिम",
    stage2: "2. बीच फसल (40%)",
    stage2Sub: "फोटो जांच पर",
    stage3: "3. कटाई बाद (40%)",
    stage3Sub: "अंतिम भुगतान",
    passbookTitle: "अपनी किसान पासबुक देखें",
    passbookSub: "नाम जोड़ें, जमीन दर्ज करें और बैंक खाते का हिसाब देखें",
    passbookBtn: "किसान पासबुक खोलें →",
    practiceData: {
      stubble: { title: "पराली प्रबंधन (ना जलाना)", badge: "सबसे आसान", desc: "पराली खेत में मिलाएं या मल्चर चलाएं। जुर्माना से बचें और सीधा नकद पाएं।" },
      notill: { title: "शून्य जुताई (Zero Tillage)", badge: "डीजल बचत", desc: "बिना गहरी जुताई के सीधी बुवाई। ट्रैक्टर का तेल बचता है और जमीन में नमी रहती है।" },
      biochar: { title: "जैविक खाद व बायोचार", badge: "अधिकतम कमाई", desc: "देसी कंपोस्ट खाद मिलाने से मिट्टी की ताकत बढ़ती है और उच्चतम दर मिलती है।" },
      agroforestry: { title: "मेड़ पर पेड़ (Field Trees)", badge: "लंबी आय", desc: "खेत की मेड़ पर फलदार या छायादार पेड़ लगाएं। लकड़ी और नियमित कार्बन आय।" },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `किसान भाई, आपके ${a} एकड़ खेत में ${p} अपनाने पर आपको सालाना लगभग ₹${total.toLocaleString("en-IN")} की कमाई होगी। इसमें से ₹${s1.toLocaleString("en-IN")} नामांकन पर तुरंत मिलेंगे, ₹${s2.toLocaleString("en-IN")} फसल के बीच फोटो जांच पर, और ₹${s3.toLocaleString("en-IN")} कटाई के बाद सीधे आपके बैंक खाते में आएंगे।`,
  },
  pa: {
    badge: "🌾 ਕਿਸਾਨ ਕਮਾਈ ਕੈਲਕੁਲੇਟਰ",
    title: "ਆਪਣੀ ਜ਼ਮੀਨ ਦੀ ਕਮਾਈ ਜਾਣੋ",
    subtitle: "ਏਕੜ ਚੁਣੋ, ਖੇਤੀ ਅਭਿਆਸ ਚੁਣੋ ਅਤੇ ਵੇਖੋ ਕਿ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਕਿੰਨੇ ਪੈਸੇ ਆਉਣਗੇ।",
    listenBtn: "ਹਿਸਾਬ ਸੁਣੋ 🔊",
    q1: "1. ਤੁਹਾਡੇ ਕੋਲ ਕਿੰਨੀ ਜ਼ਮੀਨ ਹੈ?",
    acresUnit: "ਏਕੜ",
    smallFarmer: "1 ਏਕੜ (ਛੋਟਾ ਕਿਸਾਨ)",
    q2: "2. ਤੁਸੀਂ ਕਿਹੜਾ ਤਰੀਕਾ ਅਪਣਾਓਗੇ?",
    rateLabel: "ਅਨੁਮਾਨਿਤ ਦਰ:",
    annualEarning: "ਸਿੱਧੀ ਸਾਲਾਨਾ ਕਮਾਈ",
    perYear: "/ ਪ੍ਰਤੀ ਸਾਲ",
    carbonSink: "ਅਨੁਮਾਨਿਤ ਕਾਰਬਨ ਜਮ੍ਹਾ:",
    payoutSchedule: "ਭੁਗਤਾਨ ਸਮਾਂ (3 ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਸਿੱਧਾ ਬੈਂਕ ਖਾਤਾ):",
    stage1: "1. ਰਜਿਸਟ੍ਰੇਸ਼ਨ (20%)",
    stage1Sub: "ਤੁਰੰਤ ਅਗਾਊਂ",
    stage2: "2. ਮੱਧ ਸੀਜ਼ਨ (40%)",
    stage2Sub: "ਫੋਟੋ ਜਾਂਚ 'ਤੇ",
    stage3: "3. ਵਾਢੀ ਤੋਂ ਬਾਅਦ (40%)",
    stage3Sub: "ਅੰਤਿਮ ਭੁਗਤਾਨ",
    passbookTitle: "ਆਪਣੀ ਕਿਸਾਨ ਪਾਸਬੁੱਕ ਵੇਖੋ",
    passbookSub: "ਜ਼ਮੀਨ ਦਰਜ ਕਰੋ, ਫੋਟੋਆਂ ਅੱਪਲੋਡ ਕਰੋ ਅਤੇ ਬੈਂਕ ਰਕਮ ਵੇਖੋ",
    passbookBtn: "ਕਿਸਾਨ ਪਾਸਬੁੱਕ ਖੋਲ੍ਹੋ →",
    practiceData: {
      stubble: { title: "ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ (ਨਾ ਸਾੜਨਾ)", badge: "ਸਭ ਤੋਂ ਆਸਾਨ", desc: "ਹੈਪੀ ਸੀਡਰ ਜਾਂ ਮਲਚਰ ਚਲਾਓ। ਜੁਰਮਾਨੇ ਤੋਂ ਬਚੋ ਅਤੇ ਸਿੱਧੀ ਕਮਾਈ ਕਰੋ।" },
      notill: { title: "ਜ਼ੀਰੋ ਟਿਲੇਜ (Zero Tillage)", badge: "ਡੀਜ਼ਲ ਬੱਚਤ", desc: "ਬਿਨਾਂ ਵਾਹੀ ਸਿੱਧੀ ਬਿਜਾਈ। ਟਰੈਕਟਰ ਦਾ ਤੇਲ ਬਚਦਾ ਹੈ ਅਤੇ ਨਮੀ ਬਰਕਰਾਰ ਰਹਿੰਦੀ ਹੈ।" },
      biochar: { title: "ਜੈਵਿਕ ਖਾਦ ਤੇ ਬਾਇਓਚਾਰ", badge: "ਵੱਧ ਕਮਾਈ", desc: "ਦੇਸੀ ਖਾਦ ਪਾਉਣ ਨਾਲ ਜ਼ਮੀਨ ਦੀ ਤਾਕਤ ਵਧਦੀ ਹੈ ਅਤੇ ਵੱਧ ਰੇਟ ਮਿਲਦਾ ਹੈ।" },
      agroforestry: { title: "ਵੱਟਾਂ 'ਤੇ ਰੁੱਖ", badge: "ਲੰਮੀ ਆਮਦਨ", desc: "ਖੇਤ ਦੀਆਂ ਵੱਟਾਂ 'ਤੇ ਫਲਦਾਰ ਜਾਂ ਲੱਕੜ ਵਾਲੇ ਰੁੱਖ ਲਗਾਓ।" },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `ਕਿਸਾਨ ਵੀਰੋ, ਤੁਹਾਡੇ ${a} ਏਕੜ ਖੇਤ ਵਿੱਚ ${p} ਅਪਣਾਉਣ 'ਤੇ ਤੁਹਾਨੂੰ ਸਾਲਾਨਾ ਲਗਭਗ ₹${total.toLocaleString("en-IN")} ਦੀ ਕਮਾਈ ਹੋਵੇਗੀ। ਇਸ ਵਿੱਚੋਂ ₹${s1.toLocaleString("en-IN")} ਰਜਿਸਟ੍ਰੇਸ਼ਨ 'ਤੇ ਤੁਰੰਤ, ₹${s2.toLocaleString("en-IN")} ਫਸਲ ਵਿਚਕਾਰ ਫੋਟੋ ਜਾਂਚ 'ਤੇ, ਅਤੇ ₹${s3.toLocaleString("en-IN")} ਵਾਢੀ ਤੋਂ ਬਾਅਦ ਸਿੱਧੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਆਉਣਗੇ।`,
  },
  mr: {
    badge: "🌾 शेतकरी उत्पन्न कॅल्क्युलेटर",
    title: "तुमच्या शेतीची थेट कमाई जाणून घ्या",
    subtitle: "एकर निवडा, पद्धत निवडा आणि थेट बँक खात्यात किती पैसे जमा होतील ते पहा.",
    listenBtn: "हिशोब ऐका 🔊",
    q1: "1. तुमच्याकडे किती शेतजमीन आहे?",
    acresUnit: "एकर",
    smallFarmer: "1 एकर (लहान शेतकरी)",
    q2: "2. तुम्ही कोणती पद्धत अवलंबणार आहात?",
    rateLabel: "अंदाजे दर:",
    annualEarning: "थेट वार्षिक उत्पन्न",
    perYear: "/ दर वर्षी",
    carbonSink: "अंदाजे कार्बन संचयन:",
    payoutSchedule: "पैसे मिळण्याचे वेळापत्रक (3 हप्त्यांत थेट बँक खाते):",
    stage1: "1. नोंदणी (20%)",
    stage1Sub: "तातडीने उचल",
    stage2: "2. पिकाच्या मध्यात (40%)",
    stage2Sub: "फोटो तपासणीवर",
    stage3: "3. काढणीनंतर (40%)",
    stage3Sub: "अंतिम जमा",
    passbookTitle: "आपली शेतकरी पासबुक पहा",
    passbookSub: "जमीन नोंदवा, फोटो अपलोड करा आणि खात्यातील रक्कम तपासा",
    passbookBtn: "शेतकरी पासबुक उघडा →",
    practiceData: {
      stubble: { title: "पिकांचे अवशेष व्यवस्थापन (न जाळणे)", badge: "सर्वात सोपे", desc: "अवशेष शेतात मिसळा. दंड टाळा आणि थेट रोख रक्कम मिळवा." },
      notill: { title: "शून्य मशागत (Zero Tillage)", badge: "डिझेल बचत", desc: "नांगरणीशिवाय थेट पेरणी. ट्रॅक्टर डिझेल वाचते आणि जमिनीत ओलावा टिकतो." },
      biochar: { title: "सेंद्रिय खत व बायोचार", badge: "कमाल उत्पन्न", desc: "बायोचार व सेंद्रिय खतामुळे मातीची सुपीकता वाढते आणि जास्तीत जास्त दर मिळतो." },
      agroforestry: { title: "बांधावर झाडे लावणे", badge: "दीर्घकालीन उत्पन्न", desc: "शेताच्या बांधावर झाडे लावा आणि नियमित कार्बन उत्पन्न मिळवा." },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `शेतकरी बंधूंनो, तुमच्या ${a} एकर शेतीत ${p} पद्धत वापरल्यास तुम्हाला वर्षाला अंदाजे ₹${total.toLocaleString("en-IN")} मिळतील. यापैकी ₹${s1.toLocaleString("en-IN")} नोंदणी होताच लगेच मिळतील, ₹${s2.toLocaleString("en-IN")} पिकाच्या मध्यात फोटो तपासणीवर, आणि ₹${s3.toLocaleString("en-IN")} काढणीनंतर थेट बँक खात्यात येतील.`,
  },
  gu: {
    badge: "🌾 કિસાન કમાણી કેલ્ક્યુલેટર",
    title: "તમારી જમીનની કમાણી જાણો",
    subtitle: "એકર પસંદ કરો, પદ્ધતિ પસંદ કરો અને જુઓ બેંક ખાતામાં કેટલા પૈસા આવશે.",
    listenBtn: "હિસાબ સાંભળો 🔊",
    q1: "1. તમારી પાસે કેટલી જમીન છે?",
    acresUnit: "એકર",
    smallFarmer: "1 એકર (નાનો ખેડૂત)",
    q2: "2. તમે કઈ પદ્ધતિ અપનાવશો?",
    rateLabel: "અંદાજિત દર:",
    annualEarning: "સીધી વાર્ષિક આવક",
    perYear: "/ પ્રતિ વર્ષ",
    carbonSink: "અંદાજિત કાર્બન જથ્થો:",
    payoutSchedule: "ચુકવણી સમયપત્રક (3 હપ્તામાં સીધા બેંક ખાતામાં):",
    stage1: "1. નોંધણી (20%)",
    stage1Sub: "તરત જ એડવાન્સ",
    stage2: "2. પાક વચ્ચે (40%)",
    stage2Sub: "ફોટો ચકાસણી પર",
    stage3: "3. લણણી પછી (40%)",
    stage3Sub: "અંતિમ ચુકવણી",
    passbookTitle: "તમારી કિસાન પાસબુક જુઓ",
    passbookSub: "જમીન નોંધાવો, ફોટા અપલોડ કરો અને ખાતામાં જમા થયેલ રકમ જુઓ",
    passbookBtn: "કિસાન પાસબુક ખોલો →",
    practiceData: {
      stubble: { title: "પરાળ વ્યવસ્થાપન (બાળ્યા વગર)", badge: "સૌથી સરળ", desc: "પરાળ જમીનમાં મિશ્ર કરો. દંડથી બચો અને સીધા પૈસા મેળવો." },
      notill: { title: "ઝીરો ટિલેજ (Zero Tillage)", badge: "ડીઝલ બચત", desc: "ખેડાણ વિના સીધી વાવણી. ટ્રેક્ટરનું ડીઝલ બચે અને જમીનમાં ભેજ જળવાય." },
      biochar: { title: "જૈવિક ખાતર અને બાયોચાર", badge: "મહત્તમ કમાણી", desc: "દેશી ખાતર અને બાયોચારથી જમીન ફળદ્રુપ બને છે અને શ્રેષ્ઠ દર મળે છે." },
      agroforestry: { title: "શેઢા પર વૃક્ષારોપણ", badge: "લાંબા ગાળાની આવક", desc: "ખેતરના શેઢા પર ફળાવ કે ઇમારતી વૃક્ષો વાવીને નિયમિત આવક મેળવો." },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `ખેડૂત મિત્ર, તમારા ${a} એકર ખેતરમાં ${p} અપનાવવાથી વાર્ષિક આશરે ₹${total.toLocaleString("en-IN")} ની કમાણી થશે. જેમાંથી ₹${s1.toLocaleString("en-IN")} નોંધણી વખતે તરત, ₹${s2.toLocaleString("en-IN")} પાક વચ્ચે ફોટો તપાસણી પર, અને ₹${s3.toLocaleString("en-IN")} લણણી પછી સીધા બેંક ખાતામાં મળશે.`,
  },
  ta: {
    badge: "🌾 உழவர் வருவாய் கால்குலேட்டர்",
    title: "உங்கள் நிலத்தின் வருமானத்தை கணக்கிடுங்கள்",
    subtitle: "ஏக்கரைத் தேர்ந்தெடுத்து, நடைமுறையைத் தேர்வுசெய்து வங்கி வரவைக் காண்க.",
    listenBtn: "கணக்கை குரலில் கேட்க 🔊",
    q1: "1. உங்களிடம் எவ்வளவு நிலம் உள்ளது?",
    acresUnit: "ஏக்கர்",
    smallFarmer: "1 ஏக்கர் (சிறு விவசாயி)",
    q2: "2. நீங்கள் எந்த முறையைப் பின்பற்றுவீர்கள்?",
    rateLabel: "மதிப்பிடப்பட்ட விகிதம்:",
    annualEarning: "நேரடி ஆண்டு வருமானம்",
    perYear: "/ ஒரு வருடத்திற்கு",
    carbonSink: "மதிப்பிடப்பட்ட கார்பன் அளவு:",
    payoutSchedule: "பணம் செலுத்தும் காலவரிசை (3 தவணைகளில் நேரடி வங்கி வரவு):",
    stage1: "1. பதிவு (20%)",
    stage1Sub: "உடனடி முன்பணம்",
    stage2: "2. பயிர் வளர்ச்சி (40%)",
    stage2Sub: "புகைப்பட ஆய்வில்",
    stage3: "3. அறுவடைக்கு பின் (40%)",
    stage3Sub: "இறுதி செலுத்துகை",
    passbookTitle: "உங்கள் உழவர் பாஸ்புக்கைப் பாருங்கள்",
    passbookSub: "நில விவரங்களைச் சேர்த்து வங்கிப் பணப் பலன்களைப் பெறுங்கள்",
    passbookBtn: "பாஸ்புக் திறக்க →",
    practiceData: {
      stubble: { title: "வைக்கோல் மேலாண்மை (எரிக்காமல்)", badge: "மிக எளிதானது", desc: "வைக்கோலை எரிக்காமல் நிலத்தில் சேர்க்கவும். நேரடி பணம் பெறுங்கள்." },
      notill: { title: "பூஜ்ய உழவு (Zero Tillage)", badge: "டீசல் சேமிப்பு", desc: "ஆழ உழவு இன்றி நேரடி விதைப்பு. டிராக்டர் டீசல் மிச்சமாகும்." },
      biochar: { title: "இயற்கை உரம் & பயோசார்", badge: "அதிகபட்ச வருமானம்", desc: "மண்ணின் வளம் கூடி அதிக கார்பன் விலை கிடைக்கும்." },
      agroforestry: { title: "வரப்பு மரங்கள் வளர்ப்பு", badge: "நீண்ட கால வருவாய்", desc: "வரப்புகளில் மரங்களை நட்டு கூடுதல் வருவாய் ஈட்டுங்கள்." },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `விவசாய தோழரே, உங்கள் ${a} ஏக்கர் நிலத்தில் ${p} முறையைப் பின்பற்றுவதன் மூலம் வருடத்திற்கு சுமார் ₹${total.toLocaleString("en-IN")} வருமானம் கிடைக்கும். இதில் ₹${s1.toLocaleString("en-IN")} உடனடியாகவும், ₹${s2.toLocaleString("en-IN")} நடுப்பருவ ஆய்விலும், ₹${s3.toLocaleString("en-IN")} அறுவடைக்கு பின்னும் நேரடியாக வங்கியில் சேரும்.`,
  },
  te: {
    badge: "🌾 రైతు ఆదాయ కాలిక్యులేటర్",
    title: "మీ భూమి ఆదాయాన్ని లెక్కించండి",
    subtitle: "ఎకరాలు ఎంచుకోండి, పద్ధతిని ఎంచుకోండి మరియు ఎంత నగదు జమ అవుతుందో చూడండి.",
    listenBtn: "లెక్క వినండి 🔊",
    q1: "1. మీకు ఎంత సాగుభూమి ఉంది?",
    acresUnit: "ఎకరాలు",
    smallFarmer: "1 ఎకరం (చిన్న రైతు)",
    q2: "2. మీరు ఏ పద్ధతిని పాటిస్తారు?",
    rateLabel: "అంచనా రేటు:",
    annualEarning: "ప్రత్యక్ష వార్షిక ఆదాయం",
    perYear: "/ సంవత్సరానికి",
    carbonSink: "అంచనా వేసిన కార్బన్:",
    payoutSchedule: "చెల్లింపుల కాలపట్టిక (3 విడతల్లో ప్రత్యక్ష బ్యాంక్ బదిలీ):",
    stage1: "1. నమోదు (20%)",
    stage1Sub: "తక్షణ ముందస్తు",
    stage2: "2. పంట మధ్యలో (40%)",
    stage2Sub: "ఫోటో పరిశీలనపై",
    stage3: "3. కోత తర్వాత (40%)",
    stage3Sub: "తుది చెల్లింపు",
    passbookTitle: "రైతు పాస్‌బుక్ చూడండి",
    passbookSub: "భూమి వివరాలు నమోదు చేసి నేరుగా ఖాతాలో నగదు పొందండి",
    passbookBtn: "పాస్‌బుక్ తెరవండి →",
    practiceData: {
      stubble: { title: "కొయ్యల యాజమాన్యం (కాల్చకుండా)", badge: "చాలా సులభం", desc: "కొయ్యలను నేలలో కలపండి. జరిమానాలు తప్పించి నగదు పొందండి." },
      notill: { title: "జీరో టిల్లేజ్ (Zero Tillage)", badge: "డీజిల్ ఆదా", desc: "దున్నకుండా నేరుగా విత్తడం. ట్రాక్టర్ ఇంధనం ఆదా అవుతుంది." },
      biochar: { title: "సేంద్రీయ ఎరువు & బయోచార్", badge: "గరిష్ట ఆదాయం", desc: "నేల సారం పెరిగి అత్యధిక కార్బన్ ధర లభిస్తుంది." },
      agroforestry: { title: "గట్లపై చెట్ల పెంపకం", badge: "దీర్ఘకాలిక ఆదాయం", desc: "పొలం గట్లపై చెట్లు నాటి నిరంతర కార్బన్ ఆదాయం పొందండి." },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `రైతు సోదరా, మీ ${a} ఎకరాల పొలంలో ${p} పద్ధతిని పాటించడం ద్వారా మీకు సంవత్సరానికి దాదాపు ₹${total.toLocaleString("en-IN")} ఆదాయం లభిస్తుంది. ఇందులో ₹${s1.toLocaleString("en-IN")} నమోదు కాగానే, ₹${s2.toLocaleString("en-IN")} పంట మధ్యలో, మరియు ₹${s3.toLocaleString("en-IN")} కోత తర్వాత నేరుగా మీ బ్యాంక్ ఖాతాలో జమ అవుతాయి.`,
  },
  kn: {
    badge: "🌾 ರೈತ ಆದಾಯ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
    title: "ನಿಮ್ಮ ಭೂಮಿಯ ಗಳಿಕೆಯನ್ನು ತಿಳಿಯಿರಿ",
    subtitle: "ಎಕರೆ ಆಯ್ಕೆಮಾಡಿ, ಪದ್ಧತಿ ಆರಿಸಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುವ ಹಣವನ್ನು ನೋಡಿ.",
    listenBtn: "ಲೆಕ್ಕಾಚಾರ ಆಲಿಸಿ 🔊",
    q1: "1. ನಿಮ್ಮ ಬಳಿ ಎಷ್ಟು ಕೃಷಿಭೂಮಿ ಇದೆ?",
    acresUnit: "ಎಕರೆ",
    smallFarmer: "1 ಎಕರೆ (ಸಣ್ಣ ರೈತ)",
    q2: "2. ನೀವು ಯಾವ ಪದ್ಧತಿಯನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳುತ್ತೀರಿ?",
    rateLabel: "ಅಂದಾಜು ದರ:",
    annualEarning: "ನೇರ ವಾರ್ಷಿಕ ಆದಾಯ",
    perYear: "/ ಪ್ರತಿ ವರ್ಷ",
    carbonSink: "ಅಂದಾಜು ಕಾರ್ಬನ್ ಹೀರಿಕೊಳ್ಳುವಿಕೆ:",
    payoutSchedule: "ಹಣ ಪಾವತಿ ವೇಳಾಪಟ್ಟಿ (3 ಕಂತುಗಳಲ್ಲಿ ನೇರ ಬ್ಯಾಂಕ್ ಜಮೆ):",
    stage1: "1. ನೋಂದಣಿ (20%)",
    stage1Sub: "ತಕ್ಷಣದ ಮುಂಗಡ",
    stage2: "2. ಬೆಳೆ ನಡುವೆ (40%)",
    stage2Sub: "ಫೋಟೋ ಪರಿಶೀಲನೆಗೆ",
    stage3: "3. ಕೊಯ್ಲಿನ ನಂತರ (40%)",
    stage3Sub: "ಅಂತಿಮ ಪಾವತಿ",
    passbookTitle: "ನಿಮ್ಮ ರೈತ ಪಾಸ್‌ಬುಕ್ ನೋಡಿ",
    passbookSub: "ಭೂಮಿ ದಾಖಲಿಸಿ, ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಖಾತೆಗೆ ಹಣ ಪಡೆಯಿರಿ",
    passbookBtn: "ಪಾಸ್‌ಬುಕ್ ತೆರೆಯಿರಿ →",
    practiceData: {
      stubble: { title: "ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ (ಸುಡದಿರುವುದು)", badge: "ಅತ್ಯಂತ ಸುಲಭ", desc: "ಬೆಳೆ ತ್ಯಾಜ್ಯವನ್ನು ಮಣ್ಣಿನಲ್ಲಿ ಬೆರೆಸಿ ಹಣ ಗಳಿಸಿ." },
      notill: { title: "ಶೂನ್ಯ ಉಳುಮೆ (Zero Tillage)", badge: "ಡೀಸೆಲ್ ಉಳಿತಾಯ", desc: "ಆಳ ಉಳುಮೆ ಇಲ್ಲದೆ ಬಿತ್ತನೆ. ಟ್ರ್ಯಾಕ್ಟರ್ ಡೀಸೆಲ್ ಉಳಿತಾಯವಾಗುತ್ತದೆ." },
      biochar: { title: "ಸಾವಯವ ಗೊಬ್ಬರ ಮತ್ತು ಬಯೋಚಾರ್", badge: "ಗರಿಷ್ಠ ಗಳಿಕೆ", desc: "ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಿ ಹೆಚ್ಚಿನ ಕಾರ್ಬನ್ ದರ ಪಡೆಯಿರಿ." },
      agroforestry: { title: "ಬದುವಿನ ಮರಗಳು", badge: "ದೀರ್ಘಾವಧಿ ಆದಾಯ", desc: "ಹೊಲದ ಬದುಗಳಲ್ಲಿ ಮರಗಳನ್ನು ನೆಟ್ಟು ನಿಯಮಿತ ಆದಾಯ ಗಳಿಸಿ." },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `ರೈತ ಮಿತ್ರರೆ, ನಿಮ್ಮ ${a} ಎಕರೆ ಜಮೀನಿನಲ್ಲಿ ${p} ಪದ್ಧತಿ ಅಳವಡಿಸಿಕೊಂಡರೆ ನಿಮಗೆ ವರ್ಷಕ್ಕೆ ಸುಮಾರು ₹${total.toLocaleString("en-IN")} ಆದಾಯ ಸಿಗುತ್ತದೆ. ಇದರಲ್ಲಿ ₹${s1.toLocaleString("en-IN")} ನೋಂದಣಿಯಾದ ತಕ್ಷಣ, ₹${s2.toLocaleString("en-IN")} ಬೆಳೆ ನಡುವೆ ಮತ್ತು ₹${s3.toLocaleString("en-IN")} ಕೊಯ್ಲಿನ ನಂತರ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ.`,
  },
  bn: {
    badge: "🌾 কৃষক আয় ক্যালকুলেটর",
    title: "আপনার জমির আয় জানুন",
    subtitle: "একর বেছে নিন, চাষের পদ্ধতি বাছুন এবং কত টাকা সরাসরি অ্যাকাউন্টে আসবে দেখুন।",
    listenBtn: "হিসাব শুনে নিন 🔊",
    q1: "1. আপনার কতটা চাষের জমি আছে?",
    acresUnit: "একর",
    smallFarmer: "1 একর (প্রান্তিক কৃষক)",
    q2: "2. আপনি কোন পদ্ধতি গ্রহণ করবেন?",
    rateLabel: "আনুমানিক দর:",
    annualEarning: "সরাসরি বার্ষিক আয়",
    perYear: "/ প্রতি বছর",
    carbonSink: "আনুমানিক কার্বন সঞ্চয়:",
    payoutSchedule: "টাকা পাওয়ার সময়সীমা (3 কিস্তিতে সরাসরি ব্যাংক ఖాతা):",
    stage1: "1. নিবন্ধন (20%)",
    stage1Sub: "তাৎক্ষণিক অগ্রিম",
    stage2: "2. ফসলের মাঝে (40%)",
    stage2Sub: "ছবি যাচাইয়ের পর",
    stage3: "3. কাটার পর (40%)",
    stage3Sub: "চূড়ান্ত স্থানান্তর",
    passbookTitle: "আপনার কৃষক পাসবই দেখুন",
    passbookSub: "জমি নথিভুক্ত করুন, ছবি আপলোড করুন এবং সরাসরি টাকা পান",
    passbookBtn: "পাসবই খুলুন →",
    practiceData: {
      stubble: { title: "নাড়া ব্যবস্থাপনা (না পোড়ানো)", badge: "সবচেয়ে সহজ", desc: "নাড়া না পুড়িয়ে জমিতে মেশান। জরিমানা এড়ান ও নগদ আয় করুন।" },
      notill: { title: "জিরো টিলেজ (Zero Tillage)", badge: "ডিজেল সাশ্রয়", desc: "গভীর চাষ ছাড়াই বীজ বপন। ট্র্যাক্টর ডিজেল বাঁচে ও আর্দ্রতা থাকে।" },
      biochar: { title: "জৈব সার ও বায়োচার", badge: "সর্বোচ্চ আয়", desc: "মাটির উর্বরতা বৃদ্ধি করে সর্বাধিক কার্বন দর পান।" },
      agroforestry: { title: "জমির আলে গাছ লাগানো", badge: "দীর্ঘমেয়াদী আয়", desc: "জমির সীমানায় গাছ লাগিয়ে অতিরিক্ত নিয়মিত আয় পান।" },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `কৃষক ভাই, আপনার ${a} একর জমিতে ${p} পদ্ধতি গ্রহণ করলে বছরে প্রায় ₹${total.toLocaleString("en-IN")} আয় হবে। এর মধ্যে ₹${s1.toLocaleString("en-IN")} নিবন্ধনে অবিলম্বে, ₹${s2.toLocaleString("en-IN")} ফসলের মাঝে, এবং ₹${s3.toLocaleString("en-IN")} কাটার পর সরাসরি আপনার ব্যাঙ্ক অ্যাকাউন্টে জমা হবে।`,
  },
  od: {
    badge: "🌾 କୃଷକ ଆୟ କ୍ୟାଲକୁଲେଟର",
    title: "ଆପଣଙ୍କ ଜମିର ଆୟ ଜାଣନ୍ତୁ",
    subtitle: "ଏକର ବାଛନ୍ତୁ, ପଦ୍ଧତି ଚୟନ କରନ୍ତୁ ଏବଂ ବ୍ୟାଙ୍କ ଖାତାରେ କେତେ ଟଙ୍କା ଆସିବ ଦେଖନ୍ତୁ।",
    listenBtn: "ହିସାବ ଶୁଣନ୍ତୁ 🔊",
    q1: "1. ଆପଣଙ୍କ ପାଖରେ କେତେ ଜମି ଅଛି?",
    acresUnit: "ଏକର",
    smallFarmer: "1 ଏକର (କ୍ଷୁଦ୍ର ଚାଷୀ)",
    q2: "2. ଆପଣ କେଉଁ ପଦ୍ଧତି ଆପଣାଇବେ?",
    rateLabel: "ଆକଳିତ ଦର:",
    annualEarning: "ସିଧା ବାର୍ଷିକ ଆୟ",
    perYear: "/ ବର୍ଷକୁ",
    carbonSink: "ଆକଳିତ କାର୍ବନ ସଞ୍ଚୟ:",
    payoutSchedule: "ଟଙ୍କା ପାଇବା ସମୟ (3 କିସ୍ତିରେ ସିଧା ବ୍ୟାଙ୍କ ଖାତା):",
    stage1: "1. ପଞ୍ଜୀକରଣ (20%)",
    stage1Sub: "ତୁରନ୍ତ ଅଗ୍ରୀମ",
    stage2: "2. ଫସଲ ମଧ୍ୟରେ (40%)",
    stage2Sub: "ଫଟୋ ଯାଞ୍ଚ ପରେ",
    stage3: "3. ଅମଳ ପରେ (40%)",
    stage3Sub: "ଚୂଡ଼ାନ୍ତ ପାଉଣା",
    passbookTitle: "ଆପଣଙ୍କ କୃଷକ ପାସବୁକ୍ ଦେଖନ୍ତୁ",
    passbookSub: "ଜମି ପଞ୍ଜୀକରଣ କରନ୍ତୁ ଏବଂ ସିଧାସଳଖ ବ୍ୟାଙ୍କ ଖାତାରେ ଟଙ୍କା ପାଆନ୍ତୁ",
    passbookBtn: "ପାସବୁକ୍ ଖୋଲନ୍ତୁ →",
    practiceData: {
      stubble: { title: "ନଡ଼ା ପରିଚାଳନା (ନ ପୋଡ଼ିବା)", badge: "ସବୁଠାରୁ ସହଜ", desc: "ନଡ଼ା ନ ପୋଡ଼ି ଜମିରେ ମିଶାନ୍ତୁ ଏବଂ ସିଧା ଟଙ୍କା ପାଆନ୍ତୁ।" },
      notill: { title: "ଶୂନ୍ୟ ଚାଷ (Zero Tillage)", badge: "ଡିଜେଲ ସଞ୍ଚୟ", desc: "ଗଭୀର ଚାଷ ବିନା ବୁଣିବା। ଟ୍ରାକ୍ଟର ତେଲ ବଞ୍ଚେ ଏବଂ ଆର୍ଦ୍ରତା ରହେ।" },
      biochar: { title: "ଜୈବିକ ଖତ ଓ ବାୟୋଚାର", badge: "ସର୍ବାଧିକ ଆୟ", desc: "ମାଟିର ଶକ୍ତି ବଢ଼ାଇ ସର୍ବାଧିକ କାର୍ବନ ଦର ପାଆନ୍ତୁ।" },
      agroforestry: { title: "ହିଡ଼ରେ ଗଛ ଲଗାଇବା", badge: "ଦୀର୍ଘକାଳୀନ ଆୟ", desc: "ଜମି ହିଡ଼ରେ ଫଳ ବା କାଠ ଗଛ ଲଗାଇ ନିୟମିତ ଆୟ କରନ୍ତୁ।" },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `ଚାଷୀ ଭାଇ, ଆପଣଙ୍କ ${a} ଏକର ଜମିରେ ${p} ପଦ୍ଧତି ଆପଣାଇଲେ ବାର୍ଷିକ ପ୍ରାୟ ₹${total.toLocaleString("en-IN")} ରୋଜଗାର ହେବ। ଏଥିରୁ ₹${s1.toLocaleString("en-IN")} ପଞ୍ଜୀକରଣ ସମୟରେ, ₹${s2.toLocaleString("en-IN")} ଫସଲ ମଝିରେ, ଏବଂ ₹${s3.toLocaleString("en-IN")} ଅମଳ ପରେ ସିଧା ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଖାତାକୁ ଆସିବ।`,
  },
  ml: {
    badge: "🌾 കർഷക വരുമാന കാൽക്കുലേറ്റർ",
    title: "നിങ്ങളുടെ ഭൂമിയുടെ വരുമാനം അറിയുക",
    subtitle: "ഏക്കർ തിരഞ്ഞെടുക്കുക, രീതി തെരഞ്ഞെടുക്കുക, ബാങ്കിലെത്തുന്ന പണം കാണുക.",
    listenBtn: "കണക്ക് കേൾക്കൂ 🔊",
    q1: "1. നിങ്ങളുടെ പക്കൽ എത്ര കൃഷിഭൂമിയുണ്ട്?",
    acresUnit: "ഏക്കർ",
    smallFarmer: "1 ഏക്കർ (ചെറുകിട കർഷകൻ)",
    q2: "2. നിങ്ങൾ ഏത് രീതിയാണ് നടപ്പിലാക്കുന്നത്?",
    rateLabel: "പ്രതീക്ഷിക്കുന്ന നിരക്ക്:",
    annualEarning: "നേരിട്ടുള്ള വാർഷിക വരുമാനം",
    perYear: "/ പ്രതിവർഷം",
    carbonSink: "പ്രതീക്ഷിക്കുന്ന കാർബൺ ശേഖരണം:",
    payoutSchedule: "പണം നൽകുന്ന സമയക്രമം (3 ഗഡുക്കളായി നേരിട്ട് ബാങ്കിലേക്ക്):",
    stage1: "1. രജിസ്ട്രേഷൻ (20%)",
    stage1Sub: "ഉടൻ അഡ്വാൻസ്",
    stage2: "2. വിളയുടെ ഇടയിൽ (40%)",
    stage2Sub: "ഫോട്ടോ പരിശോധനയിൽ",
    stage3: "3. വിളവെടുപ്പിന് ശേഷം (40%)",
    stage3Sub: "അവസാന ഗഡു",
    passbookTitle: "നിങ്ങളുടെ കർഷക പാസ്ബുക്ക് കാണുക",
    passbookSub: "ഭൂമി രേഖപ്പെടുത്തി നേരിട്ട് ബാങ്കിലേക്ക് ആനുകൂല്യം നേടൂ",
    passbookBtn: "പാസ്ബുക്ക് തുറക്കൂ →",
    practiceData: {
      stubble: { title: "വൈക്കോൽ സംസ്കരണം (കത്തിക്കാതെ)", badge: "ഏറ്റവും എളുപ്പം", desc: "വൈക്കോൽ മണ്ണിൽ ചേർക്കുക. പിഴ ഒഴിവാക്കി നേരിട്ട് പണം നേടൂ." },
      notill: { title: "സീറോ ടില്ലേജ് (Zero Tillage)", badge: "ഡീസൽ ലാഭം", desc: "ആഴത്തിലുള്ള ഉഴവില്ലാതെ നേരിട്ട് വിതയ്ക്കൽ. ഡീസൽ ലാഭിക്കാം." },
      biochar: { title: "ജൈവവളവും ബയോചാറും", badge: "ഉയർന്ന വരുമാനം", desc: "മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത വർദ്ധിപ്പിച്ച് മികച്ച കാർബൺ നിരക്ക് നേടൂ." },
      agroforestry: { title: "അതിരുകളിലെ മരങ്ങൾ", badge: "ദീർഘകാല വരുമാനം", desc: "അതിരുകളിൽ മരങ്ങൾ നട്ടുപിടിപ്പിച്ച് സ്ഥിരവരുമാനം നേടൂ." },
    },
    getAudioText: (a, p, total, s1, s2, s3) =>
      `കർഷക സുഹൃത്തേ, നിങ്ങളുടെ ${a} ഏക്കർ കൃഷിഭൂമിയിൽ ${p} നടപ്പിലാക്കുന്നതിലൂടെ നിങ്ങൾക്ക് പ്രതിവർഷം ഏകദേശം ₹${total.toLocaleString("en-IN")} വരുമാനം ലഭിക്കും. ഇതിൽ ₹${s1.toLocaleString("en-IN")} രജിസ്ട്രേഷൻ പൂർത്തിയാകുമ്പോൾ തന്നെയും, ₹${s2.toLocaleString("en-IN")} വിളയുടെ ഇടയിലും, ₹${s3.toLocaleString("en-IN")} വിളവെടുപ്പിന് ശേഷവും നേരിട്ട് ബാങ്കിലെത്തും.`,
  },
};

export default function FarmerEarningCalculator({ locale = "en" }: { locale?: string }) {
  const [acres, setAcres] = useState<number>(3);
  const [selectedPracticeId, setSelectedPracticeId] = useState<string>("stubble");

  const tr = TRANSLATIONS[locale] || TRANSLATIONS["en"];

  const currentPractice =
    PRACTICES.find((p) => p.id === selectedPracticeId) || PRACTICES[0];

  const totalAnnualEarnings = acres * currentPractice.ratePerAcre;
  const totalCarbonTons = (acres * currentPractice.carbonTonsPerAcre).toFixed(1);

  // 3-stage payout schedule
  const advance20 = Math.round(totalAnnualEarnings * 0.2);
  const midSeason40 = Math.round(totalAnnualEarnings * 0.4);
  const harvest40 = totalAnnualEarnings - advance20 - midSeason40;

  const practiceTrans = tr.practiceData[selectedPracticeId] || tr.practiceData["stubble"];
  const audioSummaryText = tr.getAudioText(
    acres,
    practiceTrans.title,
    totalAnnualEarnings,
    advance20,
    midSeason40,
    harvest40
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Top Banner with Clear Neutral Aesthetic */}
      <div className="bg-stone-900 text-white p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold mb-2">
              <span>{tr.badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {tr.title}
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              {tr.subtitle}
            </p>
          </div>

          <VoiceButton
            textToSpeak={audioSummaryText}
            label={tr.listenBtn}
            className="bg-stone-100 hover:bg-white text-stone-900 font-bold px-4 py-2.5 text-xs shadow-xs self-start sm:self-auto cursor-pointer"
          />
        </div>
      </div>

      <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6 cols: User selections */}
        <div className="lg:col-span-6 space-y-6">
          {/* Land Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-bold text-stone-800">
                {tr.q1}
              </label>
              <span className="text-base sm:text-lg font-bold text-stone-900 font-mono bg-stone-100 px-3 py-1 rounded-lg border border-stone-200">
                {acres} {tr.acresUnit}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
            />

            <div className="flex justify-between text-[11px] text-stone-500 font-medium mt-1">
              <span>{tr.smallFarmer}</span>
              <span>10 {tr.acresUnit}</span>
              <span>25 {tr.acresUnit}</span>
            </div>

            {/* Quick Acre Chips */}
            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 5, 10].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAcres(a)}
                  className={`px-3 py-1 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                    acres === a
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200"
                  }`}
                >
                  {a} {tr.acresUnit}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-stone-800 mb-3">
              {tr.q2}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRACTICES.map((p) => {
                const isSelected = p.id === selectedPracticeId;
                const pInfo = tr.practiceData[p.id] || tr.practiceData["stubble"];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPracticeId(p.id)}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-stone-900 bg-stone-50 shadow-xs"
                        : "border-stone-200 hover:border-stone-400 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl">{p.icon}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-stone-900 text-white"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {pInfo.badge}
                        </span>
                      </div>
                      <div className="font-bold text-stone-900 text-xs sm:text-sm">{pInfo.title}</div>
                      <div className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {pInfo.desc}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                      <span className="text-stone-500">{tr.rateLabel}</span>
                      <span className="font-bold text-stone-900 font-mono">
                        ₹{p.ratePerAcre.toLocaleString("en-IN")}/{tr.acresUnit}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 6 cols: Payout Results & Direct Bank Breakdown */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
          {/* Main Earnings Card */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold font-mono">
                {tr.annualEarning}
              </span>
              <span className="text-[11px] font-mono bg-stone-800 text-stone-200 border border-stone-700 px-2 py-0.5 rounded-full">
                70% DBT
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-extrabold font-mono text-white">
                ₹{totalAnnualEarnings.toLocaleString("en-IN")}
              </span>
              <span className="text-xs sm:text-sm text-stone-400">{tr.perYear}</span>
            </div>

            <p className="text-xs text-stone-400 mt-1">
              {tr.carbonSink} <strong className="text-white">{totalCarbonTons} tCO₂e</strong>
            </p>

            {/* 3 Installment Timeline */}
            <div className="mt-5 pt-4 border-t border-stone-800 space-y-2.5">
              <div className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                {tr.payoutSchedule}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {/* 1st */}
                <div className="bg-stone-800/80 rounded-lg p-2.5 border border-stone-700">
                  <div className="text-[10px] text-stone-400">{tr.stage1}</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
                    ₹{advance20.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[9px] text-stone-300 mt-0.5">{tr.stage1Sub}</div>
                </div>

                {/* 2nd */}
                <div className="bg-stone-800/80 rounded-lg p-2.5 border border-stone-700">
                  <div className="text-[10px] text-stone-400">{tr.stage2}</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
                    ₹{midSeason40.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[9px] text-stone-300 mt-0.5">{tr.stage2Sub}</div>
                </div>

                {/* 3rd */}
                <div className="bg-stone-800/80 rounded-lg p-2.5 border border-stone-700">
                  <div className="text-[10px] text-stone-400">{tr.stage3}</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
                    ₹{harvest40.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[9px] text-stone-300 mt-0.5">{tr.stage3Sub}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct CTA for Local Farmer */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-200 text-stone-900 flex items-center justify-center text-lg font-bold">
                📱
              </div>
              <div className="text-left">
                <div className="font-bold text-stone-900 text-xs sm:text-sm">
                  {tr.passbookTitle}
                </div>
                <div className="text-[11px] text-stone-500">
                  {tr.passbookSub}
                </div>
              </div>
            </div>

            <Link
              href={`/${locale}/farmer`}
              className="w-full sm:w-auto bg-stone-900 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all text-center"
            >
              {tr.passbookBtn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
