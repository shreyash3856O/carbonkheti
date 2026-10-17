"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, locales, localeNames, Locale } from "@/i18n/routing";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
  timestamp: string;
}

interface AssistantStrings {
  title: string;
  subtitle: string;
  listening: string;
  speaking: string;
  processing: string;
  idle: string;
  greeting: string;
  quickTitle: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  placeholder: string;
  footer: string;
  close: string;
  userLabel: string;
  botLabel: string;
  listenAgain: string;
  speechLang: string;
}

const STRINGS: Record<string, AssistantStrings> = {
  en: {
    title: "Farmer Voice Assistant (Kisan Mitra)",
    subtitle: "Speak or type • Instant & simple answers",
    listening: "Listening... speak now!",
    speaking: "Speaking answer aloud...",
    processing: "Thinking...",
    idle: "Tap mic or choose a question below",
    greeting: "Welcome farmer friend! I am your CarbonKheti Voice Assistant (Kisan Mitra). Tap the microphone to ask questions or choose a topic below — I will answer and explain to you aloud!",
    quickTitle: "QUICK QUESTIONS (TAP TO ASK):",
    q1: "How much will I earn from 2 acres of land?",
    q2: "What are the benefits of avoiding stubble burning?",
    q3: "When and how do payouts reach my bank account?",
    q4: "How to upload farm photo evidence?",
    placeholder: "Type your question or tap mic to speak...",
    footer: "100% Local & Secure • Speak in Any Language • Direct Bank Payouts",
    close: "Close",
    userLabel: "You",
    botLabel: "Kisan Mitra",
    listenAgain: "Listen again",
    speechLang: "en-IN",
  },
  hi: {
    title: "किसान आवाज़ साथी (Kisan Mitra)",
    subtitle: "बोलकर पूछें • सीधा और आसान जवाब",
    listening: "सुन रहा हूँ... बोलिए!",
    speaking: "आवाज़ में जवाब दे रहा हूँ...",
    processing: "जवाब तैयार हो रहा है...",
    idle: "माइक दबाकर सवाल बोलें",
    greeting: "राम-राम किसान भाई! मैं आपका कार्बनखेती आवाज़ साथी (Kisan Mitra) हूँ। माइक दबाकर बोलें या नीचे दिए गए सवाल चुनें — मैं आपको बोलकर समझाऊंगा!",
    quickTitle: "सीधे सवाल पूछें (TAP TO ASK):",
    q1: "मेरे 2 एकड़ खेत में कितना पैसा मिलेगा?",
    q2: "धान की पराली न जलाने पर क्या लाभ है?",
    q3: "पैसे बैंक खाते में कब और कैसे आते हैं?",
    q4: "खेत का फोटो और सबूत कैसे अपलोड करें?",
    placeholder: "यहाँ लिखें या माइक दबाकर बोलें...",
    footer: "100% स्थानीय और सुरक्षित • किसी भी भाषा में बोलें • सीधे बैंक में पैसा",
    close: "बंद करें",
    userLabel: "आप (You)",
    botLabel: "किसान मित्र",
    listenAgain: "दोबारा सुनें",
    speechLang: "hi-IN",
  },
  pa: {
    title: "ਕਿਸਾਨ ਆਵਾਜ਼ ਸਾਥੀ (ਕਿਸਾਨ ਮਿੱਤਰ)",
    subtitle: "ਬੋਲ ਕੇ ਪੁੱਛੋ • ਸਿੱਧਾ ਅਤੇ ਆਸਾਨ ਜਵਾਬ",
    listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ ਜੀ!",
    speaking: "ਆਵਾਜ਼ ਵਿੱਚ ਜਵਾਬ ਦੇ ਰਿਹਾ ਹਾਂ...",
    processing: "ਜਵਾਬ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ...",
    idle: "ਮਾਈਕ ਦਬਾ ਕੇ ਸਵਾਲ ਬੋਲੋ",
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਕਾਰਬਨਖੇਤੀ ਆਵਾਜ਼ ਸਾਥੀ ਹਾਂ। ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਸਵਾਲ ਚੁਣੋ — ਮੈਂ ਤੁਹਾਨੂੰ ਬੋਲ ਕੇ ਸਮਝਾਵਾਂਗਾ!",
    quickTitle: "ਸਵਾਲ ਪੁੱਛੋ (ਟੈਪ ਕਰੋ):",
    q1: "ਮੇਰੇ 2 ਏਕੜ ਖੇਤ ਵਿੱਚ ਕਿੰਨੇ ਪੈਸੇ ਮਿਲਣਗੇ?",
    q2: "ਪਰਾਲੀ ਨਾ ਸਾੜਨ 'ਤੇ ਕੀ ਲਾਭ ਹੁੰਦਾ ਹੈ?",
    q3: "ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਕਦੋਂ ਅਤੇ ਕਿਵੇਂ ਆਉਂਦੇ ਹਨ?",
    q4: "ਖੇਤ ਦੀ ਫੋਟੋ ਅਤੇ ਸਬੂਤ ਕਿਵੇਂ ਅੱਪਲੋਡ ਕਰੀਏ?",
    placeholder: "ਇੱਥੇ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ...",
    footer: "100% ਸਥਾਨਕ ਤੇ ਸੁਰੱਖਿਅਤ • ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲੋ • ਸਿੱਧਾ ਬੈਂਕ ਵਿੱਚ ਪੈਸੇ",
    close: "ਬੰਦ ਕਰੋ",
    userLabel: "ਤੁਸੀਂ",
    botLabel: "ਕਿਸਾਨ ਮਿੱਤਰ",
    listenAgain: "ਦੁਬਾਰਾ ਸੁਣੋ",
    speechLang: "pa-IN",
  },
  mr: {
    title: "शेतकरी आवाज साथी (किसान मित्र)",
    subtitle: "बोलून विचारा • थेट आणि सोपी उत्तरे",
    listening: "ऐकत आहे... बोला!",
    speaking: "उत्तर वाचून दाखवत आहे...",
    processing: "उत्तर तयार होत आहे...",
    idle: "माइक दाबून प्रश्न विचारा",
    greeting: "राम-राम शेतकरी बंधूंनो! मी तुमचा कार्बनशेती आवाज साथी आहे. माइक दाबून बोला किंवा खालील प्रश्न निवडा — मी तुम्हाला बोलून समजावून सांगेन!",
    quickTitle: "थेट प्रश्न विचारा (टॅप करा):",
    q1: "माझ्या 2 एकर शेतात किती पैसे मिळतील?",
    q2: "पिकांचे अवशेष न जाळण्याचे काय फायदे आहेत?",
    q3: "बँक खात्यात पैसे कधी आणि कसे जमा होतात?",
    q4: "शेताचा फोटो आणि पुरावा कसा अपलोड करायचा?",
    placeholder: "येथे लिहा किंवा माइक दाबून बोला...",
    footer: "100% स्थानिक व सुरक्षित • कोणत्याही भाषेत बोला • थेट बँकेत पैसे",
    close: "बंद करा",
    userLabel: "तुम्ही",
    botLabel: "किसान मित्र",
    listenAgain: "पुन्हा ऐका",
    speechLang: "mr-IN",
  },
  gu: {
    title: "કિસાન અવાજ સાથી (કિસાન મિત્ર)",
    subtitle: "બોલીને પૂછો • સીધો અને સરળ જવાબ",
    listening: "સાંભળી રહ્યો છું... બોલો!",
    speaking: "અવાજમાં જવાબ આપી રહ્યો છું...",
    processing: "જવાબ તૈયાર થઈ રહ્યો છે...",
    idle: "માઇક દબાવીને પ્રશ્ન પૂછો",
    greeting: "રામ-રામ ખેડૂત મિત્ર! હું તમારો કાર્બનખેતી અવાજ સાથી છું. માઇક દબાવીને બોલો અથવા નીચેના પ્રશ્નો પસંદ કરો — હું તમને બોલીને સમજાવીશ!",
    quickTitle: "ઝડપી પ્રશ્નો (ટેપ કરો):",
    q1: "મારા 2 એકર ખેતરમાં કેટલા પૈસા મળશે?",
    q2: "પરાળ ન બાળવાના શું ફાયદા છે?",
    q3: "બેંક ખાતામાં પૈસા ક્યારે અને કેવી રીતે આવે છે?",
    q4: "ખેતરનો ફોટો અને પુરાવો કેવી રીતે અપલોડ કરવો?",
    placeholder: "અહીં લખો અથવા માઇક દબાવીને બોલો...",
    footer: "100% સ્થાનિક અને સુરક્ષિત • કોઈપણ ભાષામાં બોલો • સીધા બેંકમાં પૈસા",
    close: "બંધ કરો",
    userLabel: "તમે",
    botLabel: "કિસાન મિત્ર",
    listenAgain: "ફરી સાંભળો",
    speechLang: "gu-IN",
  },
  ta: {
    title: "உழவர் குரல் தோழன் (கிசான் மித்ரா)",
    subtitle: "பேசி கேளுங்கள் • நேரடி மற்றும் எளிய பதில்",
    listening: "கேட்கிறேன்... பேசுங்கள்!",
    speaking: "பதிலை குரலில் கூறுகிறேன்...",
    processing: "பதில் தயாராகிறது...",
    idle: "மைக்கை அழுத்தி கேள்வி கேட்கவும்",
    greeting: "வணக்கம் விவசாய தோழரே! நான் உங்கள் கார்பன்சேதி குரல் தோழன். மைக்கை அழுத்தி பேசுங்கள் அல்லது கீழே உள்ள கேள்விகளை தேர்வு செய்யுங்கள் — நான் உங்களுக்கு பதிலளிப்பேன்!",
    quickTitle: "விரைவு கேள்விகள் (தேர்வு செய்க):",
    q1: "எனது 2 ஏக்கர் நிலத்தில் எவ்வளவு பணம் கிடைக்கும்?",
    q2: "வைக்கோல் எரிக்காமல் இருப்பதன் நன்மைகள் என்ன?",
    q3: "வங்கி கணக்கில் பணம் எப்போது, எப்படி வரும்?",
    q4: "பண்ணை புகைப்பட ஆதாரத்தை எவ்வாறு பதிவேற்றுவது?",
    placeholder: "இங்கு தட்டச்சு செய்க அல்லது பேசவும்...",
    footer: "100% உள்ளூர் மற்றும் பாதுகாப்பானது • எந்த மொழியிலும் பேசுங்கள் • நேரடி வங்கி செலுத்துகை",
    close: "மூடு",
    userLabel: "நீங்கள்",
    botLabel: "கிசான் மித்ரா",
    listenAgain: "மீண்டும் கேட்க",
    speechLang: "ta-IN",
  },
  te: {
    title: "రైతు వాయిస్ మిత్ర (కిసాన్ మిత్ర)",
    subtitle: "మాట్లాడి అడగండి • ప్రత్యక్ష మరియు సులభ సమాధానం",
    listening: "వింటున్నాను... మాట్లాడండి!",
    speaking: "సమాధానం చదువుతున్నాను...",
    processing: "సమాధానం సిద్ధమవుతోంది...",
    idle: "మైక్ నొక్కి ప్రశ్న అడగండి",
    greeting: "నమస్కారం రైతు సోదరా! నేను మీ కార్బన్‌ఖೇతి వాయిస్ మిత్రుడిని. మైక్ నొక్కి మాట్లాడండి లేదా కింద ఉన్న ప్రశ్నలను ఎంచుకోండి — నేను మీకు వివరిస్తాను!",
    quickTitle: "త్వరిత ప్రశ్నలు (నొక్కండి):",
    q1: "నా 2 ఎకరాల పొలంలో ఎంత డబ్బు వస్తుంది?",
    q2: "కొయ్యలు కాల్చకపోవడం వల్ల ప్రయోజనాలు ఏమిటి?",
    q3: "బ్యాంక్ ఖాతాలో డబ్బు ఎప్పుడు, ఎలా జమ అవుతుంది?",
    q4: "పొలం ఫోటో సాక్ష్యాన్ని ఎలా అప్‌లోడ్ చేయాలి?",
    placeholder: "ఇక్కడ రాయండి లేదా మైక్ నొక్కి మాట్లాడండి...",
    footer: "100% స్థానిక & సురక్షితం • ఏ భాషలోనైనా మాట్లాడండి • ప్రత్యక్ష బ్యాంక్ జమ",
    close: "మూసివేయి",
    userLabel: "మీరు",
    botLabel: "కిసాన్ మిత్ర",
    listenAgain: "మళ్ళీ వినండి",
    speechLang: "te-IN",
  },
  kn: {
    title: "ರೈತ ಧ್ವನಿ ಮಿತ್ರ (ಕಿಸಾನ್ ಮಿತ್ರ)",
    subtitle: "ಮಾತನಾಡಿ ಕೇಳಿ • ನೇರ ಮತ್ತು ಸುಲಭ ಉತ್ತರ",
    listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ!",
    speaking: "ಉತ್ತರವನ್ನು ಓದುತ್ತಿದ್ದೇನೆ...",
    processing: "ಉತ್ತರ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",
    idle: "ಮೈಕ್ ಒತ್ತಿ ಪ್ರಶ್ನೆ ಕೇಳಿ",
    greeting: "ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೆ! ನಾನು ನಿಮ್ಮ ಕಾರ್ಬನ್‌ಖೇತಿ ಧ್ವನಿ ಮಿತ್ರ. ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಆರಿಸಿ — ನಾನು ನಿಮಗೆ ಉತ್ತರಿಸುತ್ತೇನೆ!",
    quickTitle: "ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು (ಟ್ಯಾಪ್ ಮಾಡಿ):",
    q1: "ನನ್ನ 2 ಎಕರೆ ಜಮೀನಿನಲ್ಲಿ ಎಷ್ಟು ಹಣ ಸಿಗುತ್ತದೆ?",
    q2: "ಬೆಳೆ ತ್ಯಾಜ್ಯ ಸುಡದಿರುವುದರಿಂದ ಏನು ಪ್ರಯೋಜನ?",
    q3: "ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ಯಾವಾಗ ಮತ್ತು ಹೇಗೆ ಬರುತ್ತದೆ?",
    q4: "ಜಮೀನಿನ ಫೋಟೋ ಪುರಾವೆಯನ್ನು ಹೇಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದು?",
    placeholder: "ಇಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ...",
    footer: "100% ಸ್ಥಳೀಯ ಮತ್ತು ಸುರಕ್ಷಿತ • ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ • ನೇರ ಬ್ಯಾಂಕ್ ಪಾವತಿ",
    close: "ಮುಚ್ಚಿ",
    userLabel: "ನೀವು",
    botLabel: "ಕಿಸಾನ್ ಮಿತ್ರ",
    listenAgain: "ಮತ್ತೆ ಆಲಿಸಿ",
    speechLang: "kn-IN",
  },
  bn: {
    title: "কৃষক ভয়েস বন্ধু (কিশান মিত্র)",
    subtitle: "মুখে বলুন • সহজ ও স্পষ্ট উত্তর",
    listening: "শুনছি... বলুন!",
    speaking: "উত্তর পড়ে শোনাচ্ছি...",
    processing: "উত্তর তৈরি হচ্ছে...",
    idle: "মাইক টিপে প্রশ্ন বলুন",
    greeting: "নমস্কার কৃষক ভাই! আমি আপনার কার্বনখেতি ভয়েস বন্ধু। মাইক টিপে কথা বলুন বা নিচের প্রশ্নগুলি বাছুন — আমি আপনাকে বুঝিয়ে বলব!",
    quickTitle: "সহজ প্রশ্ন (ট্যাপ করুন):",
    q1: "আমার ২ একর জমিতে কত টাকা পাব?",
    q2: "নাড়া না পোড়ানোর সুবিধা কী?",
    q3: "ব্যাঙ্ক অ্যাকাউন্টে টাকা কখন ও কীভাবে আসে?",
    q4: "জমির ছবি ও প্রমাণ কীভাবে আপলোড করব?",
    placeholder: "এখানে লিখুন বা মাইকে কথা বলুন...",
    footer: "100% স্থানীয় ও সুরক্ষিত • যেকোনো ভাষায় বলুন • সরাসরি ব্যাঙ্কে টাকা",
    close: "বন্ধ করুন",
    userLabel: "আপনি",
    botLabel: "কিশান মিত্র",
    listenAgain: "আবার শুনুন",
    speechLang: "bn-IN",
  },
  od: {
    title: "କୃଷକ ଭଏସ୍ ସାଥୀ (କିଷାନ ମିତ୍ର)",
    subtitle: "କହି ପଚାରନ୍ତୁ • ସହଜ ଓ ସିଧା ଉତ୍ତର",
    listening: "ଶୁଣୁଛି... କୁହନ୍ତୁ!",
    speaking: "ଉତ୍ତର ଶୁଣାଉଛି...",
    processing: "ଉତ୍ତର ପ୍ରସ୍ତୁତ ହେଉଛି...",
    idle: "ମାଇକ୍ ଦବାଇ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ",
    greeting: "ନମସ୍କାର ଚାଷୀ ଭାଇ! ମୁଁ ଆପଣଙ୍କ କାର୍ବନଖେତି ଭଏସ୍ ସାଥୀ। ମାଇକ୍ ଦବାଇ କଥା ହୁଅନ୍ତୁ ବା ତଳେ ଥିବା ପ୍ରଶ୍ନ ବାଛନ୍ତୁ — ମୁଁ ବୁଝାଇ କହିବି!",
    quickTitle: "ଶୀଘ୍ର ପ୍ରଶ୍ନ (ଟ୍ୟାପ୍ କରନ୍ତୁ):",
    q1: "ମୋର 2 ଏକର ଜମିରୁ କେତେ ଟଙ୍କା ମିଳିବ?",
    q2: "ନଡ଼ା ନ ପୋଡ଼ିବାର ଲାଭ କ'ଣ?",
    q3: "ବ୍ୟାଙ୍କ ଖାତାରେ ଟଙ୍କା କେବେ ଓ କିପରି ଆସେ?",
    q4: "ଜମିର ଫଟୋ ପ୍ରମାଣ କିପରି ଅପଲୋଡ୍ କରିବେ?",
    placeholder: "ଏଠାରେ ଲେଖନ୍ତୁ ବା ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ...",
    footer: "100% ସ୍ଥାନୀୟ ଓ ସୁରକ୍ଷିତ • ଯେକୌଣସି ଭାଷାରେ କୁହନ୍ତୁ • ସିଧା ବ୍ୟାଙ୍କରେ ଟଙ୍କା",
    close: "ବନ୍ଦ କରନ୍ତୁ",
    userLabel: "ଆପଣ",
    botLabel: "କିଷାନ ମିତ୍ର",
    listenAgain: "ପୁଣି ଶୁଣନ୍ତୁ",
    speechLang: "hi-IN",
  },
  ml: {
    title: "കർഷക വോയ്‌സ് മിത്ര (കിസാൻ മിത്ര)",
    subtitle: "സംസാരിച്ചു ചോദിക്കൂ • ലളിതമായ മറുപടി",
    listening: "കേൾക്കുന്നു... പറയൂ!",
    speaking: "ഉത്തരം പറയുന്നു...",
    processing: "ഉത്തരം തയ്യാറാകുന്നു...",
    idle: "മൈക്ക് അമർത്തി ചോദ്യം ചോദിക്കൂ",
    greeting: "നമസ്കാരം കർഷക സുഹൃത്തേ! ഞാൻ നിങ്ങളുടെ കാർബൺഖേതി വോയ്‌സ് മിത്രമാണ്. മൈക്ക് അമർത്തി സംസാരിക്കുകയോ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുകയോ ചെയ്യുക — ഞാൻ പറഞ്ഞുതരാം!",
    quickTitle: "ചോദ്യങ്ങൾ (ടാപ്പ് ചെയ്യുക):",
    q1: "എന്റെ 2 ഏക്കർ കൃഷിയിൽ നിന്ന് എത്ര വരുമാനം ലഭിക്കും?",
    q2: "വൈക്കോൽ കത്തിക്കാതിരുന്നാൽ എന്ത് നേട്ടമാണ്?",
    q3: "ബാങ്ക് അക്കൗണ്ടിൽ പണം എപ്പോൾ, എങ്ങനെ എത്തും?",
    q4: "കൃഷിയിടത്തിന്റെ ഫോട്ടോ തെളിവ് എങ്ങനെ അപ്‌ലോഡ് ചെയ്യാം?",
    placeholder: "ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...",
    footer: "100% പ്രാദേശികവും സുരക്ഷിതവും • ഏത് ഭാഷയിലും സംസാരിക്കാം • നേരിട്ട് ബാങ്കിൽ പണം",
    close: "അടയ്ക്കുക",
    userLabel: "നിങ്ങൾ",
    botLabel: "കിസാൻ മിത്ര",
    listenAgain: "വീണ്ടും കേൾക്കുക",
    speechLang: "ml-IN",
  },
};

export default function VoiceAssistant({ currentLocale = "en" }: { currentLocale?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Active language is strictly synchronized with website locale
  const activeLocale = STRINGS[currentLocale] ? currentLocale : "en";
  const tr = STRINGS[activeLocale];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      role: "assistant",
      content: tr.greeting,
      provider: "groq",
      timestamp: "now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  // When website locale changes, update the greeting
  useEffect(() => {
    setMessages([
      {
        id: `intro-${activeLocale}`,
        role: "assistant",
        content: tr.greeting,
        provider: "groq",
        timestamp: "now",
      },
    ]);
  }, [activeLocale, tr.greeting]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Handle language switch inside the chatbot dropdown
  // This updates BOTH website and chatbot simultaneously
  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === activeLocale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const cleanPath = !pathname || pathname === "/" ? "" : pathname;
    window.location.href = `/${newLocale}${cleanPath}`;
  };

  // Initialize SpeechRecognition on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = tr.speechLang;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [tr.speechLang]);

  // Text-To-Speech Playback
  const speakResponse = (text: string, lang = tr.speechLang) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (match) utterance.voice = match;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    stopSpeaking();
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. You can type your question in the text box.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = tr.speechLang;
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start failed:", err);
        setIsListening(false);
      }
    }
  };

  // Send message to Groq LLaMA-3.3-70B API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      const response = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          locale: activeLocale,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await response.json();
      const reply = data.reply || "I am here to help you earn from carbon credits. Please ask about your land or practices.";

      const assistantMessage: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: reply,
        provider: data.provider || "groq",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakResponse(reply, tr.speechLang);
    } catch (err) {
      console.error("Failed to query voice assistant:", err);
      const fallbackReply = activeLocale === "hi"
        ? "किसान भाई, तकनीकी समस्या के कारण उत्तर नहीं मिल सका। आप सीधे टोल-फ्री 1800-227-266 पर संपर्क कर सकते हैं।"
        : "Dear farmer, unable to reach the server. Please call toll-free 1800-227-266 for assistance.";
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: fallbackReply,
          provider: "fallback",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speakResponse(fallbackReply, tr.speechLang);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Floating Button in Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-stone-900 text-white px-3.5 py-2 rounded-full text-xs shadow-md border border-stone-700 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <span className="font-semibold">{tr.title}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              speakResponse(tr.greeting, tr.speechLang);
            } else {
              stopSpeaking();
              setIsOpen(false);
            }
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
            isOpen ? "bg-stone-800 hover:bg-stone-700" : "bg-stone-900 hover:bg-black hover:scale-105"
          }`}
          aria-label={tr.title}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-stone-100 rounded-full border-2 border-stone-900" />
            </div>
          )}
        </button>
      </div>

      {/* Pop-up Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header: Synchronized with Website Language */}
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-lg">
                  🌾
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white">
                    {tr.title}
                  </h3>
                  <p className="text-[11px] text-stone-300">
                    {tr.subtitle}
                  </p>
                </div>
              </div>

              {/* Shared Language Switcher - Synchronizes Both Website & Chatbot */}
              <div className="flex items-center gap-2">
                <select
                  value={activeLocale}
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  className="bg-stone-800 text-stone-200 text-xs rounded-lg px-2.5 py-1.5 border border-stone-700 cursor-pointer focus:outline-none"
                  aria-label="Select Common Language"
                >
                  {locales.map((loc) => (
                    <option key={loc} value={loc} className="text-stone-900 bg-white">
                      {localeNames[loc].nativeName}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    if (isListening && recognitionRef.current) {
                      recognitionRef.current.stop();
                      setIsListening(false);
                    }
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-sm transition-colors cursor-pointer"
                  title={tr.close}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sub-banner: Simple status */}
            <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-500" />
                <span className="font-medium">
                  {isListening
                    ? tr.listening
                    : isSpeaking
                    ? tr.speaking
                    : isProcessing
                    ? tr.processing
                    : tr.idle}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="text-[10px] text-stone-600 hover:text-stone-900 underline cursor-pointer"
              >
                {showKeyConfig ? "Hide" : "Groq API"}
              </button>
            </div>

            {/* Optional Groq API Key Config Dropdown */}
            {showKeyConfig && (
              <div className="bg-stone-50 p-3 border-b border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Groq API Key (Local):</span>
                  <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-mono">
                    LLaMA-3.3-70B Active
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="gsk_..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 font-mono bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => alert("Groq Key saved for this session!")}
                    className="bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Messages Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[360px] bg-stone-50/50">
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                        isAssistant
                          ? "bg-white text-stone-800 border border-stone-200 rounded-tl-xs"
                          : "bg-stone-900 text-white rounded-tr-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-[10px] font-bold tracking-wider uppercase opacity-75">
                          {isAssistant ? `🌾 ${tr.botLabel}` : `👤 ${tr.userLabel}`}
                        </span>
                        {isAssistant && (
                          <button
                            type="button"
                            onClick={() => speakResponse(m.content, tr.speechLang)}
                            className="text-[10px] text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                            title={tr.listenAgain}
                          >
                            <span>🔊 {tr.listenAgain}</span>
                          </button>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Prompts */}
            <div className="p-3 bg-white border-t border-stone-200">
              <div className="text-[10px] font-bold text-stone-500 mb-2 uppercase tracking-wider">
                {tr.quickTitle}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { text: tr.q1, icon: "🌾" },
                  { text: tr.q2, icon: "🔥" },
                  { text: tr.q3, icon: "💰" },
                  { text: tr.q4, icon: "📸" },
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q.text)}
                    className="shrink-0 text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-lg px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{q.icon}</span>
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Voice Trigger Area */}
            <div className="p-3 bg-white border-t border-stone-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? "bg-stone-900 text-white animate-pulse"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
                  }`}
                  title={isListening ? "Stop listening" : "Start speaking"}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={tr.placeholder}
                  className="flex-1 bg-stone-50 border border-stone-300 text-stone-900 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-400"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className="w-11 h-11 rounded-xl bg-stone-900 hover:bg-black disabled:bg-stone-200 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>

              <div className="mt-2 text-center text-[10px] text-stone-500">
                {tr.footer}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
