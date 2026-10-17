import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const DEFAULT_GROQ_API_KEY = process.env.GROQ_API_KEY || "";

function getSmartFallbackReply(userMsg: string, locale: string = "en"): string {
  const q = userMsg.toLowerCase();

  if (locale === "en") {
    if (q.includes("earn") || q.includes("how much") || q.includes("acre") || q.includes("money") || q.includes("price")) {
      return "Farmer friend, you can earn approximately ₹1,500 to ₹4,000 per acre every year through CarbonKheti. 70% of total revenue is paid directly into your bank account across 3 milestone stages.";
    }
    if (q.includes("stubble") || q.includes("burn") || q.includes("residue")) {
      return "By incorporating stubble instead of burning, you avoid fines, improve soil moisture, and earn up to 2.5 carbon credits per acre, adding around ₹3,500 in clean direct revenue.";
    }
    if (q.includes("photo") || q.includes("proof") || q.includes("evidence") || q.includes("upload")) {
      return "Uploading field photos is easy! Open your Digital Passbook, snap a photo with your mobile camera, and your GPS location and timestamp are securely verified automatically.";
    }
    if (q.includes("bank") || q.includes("payout") || q.includes("dbt") || q.includes("account") || q.includes("when")) {
      return "Payments are transferred directly into your Aadhaar-linked bank account or UPI via DBT in 3 installments: 20% on enrollment, 40% mid-season, and 40% post-harvest.";
    }
    return "Hello farmer friend! Welcome to CarbonKheti. You can ask about your potential land earnings, stubble management benefits, or direct bank payouts.";
  }

  if (locale === "pa") {
    if (q.includes("ਪੈਸੇ") || q.includes("ਕਮਾਈ") || q.includes("ਏਕੜ")) {
      return "ਕਿਸਾਨ ਵੀਰੋ, ਕਾਰਬਨਖੇਤੀ ਰਾਹੀਂ ਤੁਸੀਂ ਪ੍ਰਤੀ ਏਕੜ ਸਾਲਾਨਾ ₹1,500 ਤੋਂ ₹4,000 ਸਿੱਧੇ ਬੈਂਕ ਵਿੱਚ ਕਮਾ ਸਕਦੇ ਹੋ। 70% ਰਕਮ 3 ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਸਿੱਧੀ ਤੁਹਾਡੇ ਖਾਤੇ ਵਿੱਚ ਆਉਂਦੀ ਹੈ।";
    }
    if (q.includes("ਪਰਾਲੀ") || q.includes("ਸਾੜ")) {
      return "ਪਰਾਲੀ ਨਾ ਸਾੜਨ ਅਤੇ ਮਲਚਰ ਚਲਾਉਣ ਨਾਲ ਜ਼ਮੀਨ ਦੀ ਸਿਹਤ ਸੁਧਰਦੀ ਹੈ ਅਤੇ ਤੁਹਾਨੂੰ ਪ੍ਰਤੀ ਏਕੜ 2.5 ਟਨ ਤੱਕ ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ ਕਮਾਈ ਮਿਲਦੀ ਹੈ।";
    }
    return "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਤੁਸੀਂ ਕਾਰਬਨਖੇਤੀ ਰਾਹੀਂ ਆਪਣੀ ਜ਼ਮੀਨ ਦੀ ਕਮਾਈ, ਪਰਾਲੀ ਪ੍ਰਬੰਧਨ ਜਾਂ ਬੈਂਕ ਖਾਤੇ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।";
  }

  if (locale === "gu") {
    if (q.includes("પૈસા") || q.includes("કમાણી") || q.includes("એકર")) {
      return "ખેડૂત મિત્ર, કાર્બનખેતી દ્વારા તમે દર એકરે વાર્ષિક ₹1,500 થી ₹4,000 સીધા તમારા બેંક ખાતામાં મેળવી શકો છો. 70% રકમ સીધી તમારા બેંક ખાતામાં જમા થાય છે.";
    }
    return "નમસ્તે ખેડૂત મિત્ર! તમે કાર્બનખેતીથી જમીનની કમાણી, પરાળ વ્યવસ્થાપન કે બેંક ચુકવણી વિશે પૂછી શકો છો.";
  }

  if (locale === "mr") {
    if (q.includes("पैसे") || q.includes("कमाई") || q.includes("एकर")) {
      return "शेतकरी बंधूंनो, कार्बनशेतीतून तुम्ही एकरी वर्षाला ₹1,500 ते ₹4,000 थेट बँक खात्यात मिळवू शकता. 70% रक्कम 3 हप्त्यांत थेट जमा होते.";
    }
    return "राम-राम शेतकरी बंधूंनो! तुम्ही कार्बनशेतीतून मिळणारे उत्पन्न, पिकांचे अवशेष व्यवस्थापन किंवा बँक खात्याबद्दल विचारू शकता.";
  }

  // Default Hindi
  if (q.includes("कितना") || q.includes("पैसा") || q.includes("कमाई") || q.includes("रुपय") || q.includes("रुपया")) {
    return "किसान भाई, कार्बनखेती से आप हर एकड़ जमीन पर सालाना ₹1,500 से ₹4,000 तक सीधे अपने बैंक खाते में कमा सकते हैं। 70% पैसा सीधे आपके खाते में 3 किस्तों में ट्रांसफर किया जाता है।";
  }

  if (q.includes("पराली") || q.includes("जलाना")) {
    return "धान की पराली को जलाने के बजाय खेत में मिलाने या बायोचार बनाने पर प्रदूषण नहीं होता और आपको प्रति एकड़ 2.5 टन तक कार्बन क्रेडिट मिलता है, जिससे लगभग ₹3,500 तक अतिरिक्त आमदनी होती है।";
  }

  if (q.includes("फोटो") || q.includes("तस्वीर") || q.includes("अपलोड")) {
    return "खेत की तस्वीर भेजना बहुत आसान है! किसान पासबुक पेज पर जाकर 'खेत का फोटो' विकल्प चुनें। अपने मोबाइल कैमरे से फोटो खींचें, आपकी लोकेशन अपने आप दर्ज हो जाएगी।";
  }

  if (q.includes("बैंक") || q.includes("खाता") || q.includes("dbt")) {
    return "पैसे सीधे आपके आधार से जुड़े बैंक खाते या UPI में डायरेक्ट बेनिफिट ट्रांसफर (DBT) के ज़रिये 3 किस्तों (20%, 40%, 40%) में आते हैं।";
  }

  return "नमस्ते किसान भाई! मैं कार्बनखेती का आवाज़ साथी (किसान मित्र) हूँ। आप मुझसे पूछ सकते हैं कि आपकी जमीन पर कितनी कमाई होगी या पैसे बैंक में कैसे आएंगे!";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], locale = "en", apiKey } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const keyToUse = apiKey && apiKey.trim().length > 10 ? apiKey.trim() : DEFAULT_GROQ_API_KEY;

    let reply = "";
    let provider = "groq";
    let isFallback = false;

    try {
      const groq = new Groq({ apiKey: keyToUse });

      const systemPrompt = `You are "Kisan Mitra" (CarbonKheti Sahayak), an empathetic, cheerful agricultural voice assistant for Indian farmers.
CRITICAL LANGUAGE DIRECTIVE:
- The website and chatbot are currently set to locale "${locale}".
- You MUST answer STRICTLY in "${locale}" language (e.g. if en, answer in plain clear English; if hi, answer in Hindi Devanagari; if pa, answer in Punjabi Gurmukhi; if mr, answer in Marathi; if gu, answer in Gujarati; if ta, Tamil; if te, Telugu; if kn, Kannada; if bn, Bengali).
- Do not switch to Hindi if the user selected English ("en"). Always reply in English when locale is "en".
- Tone and Length:
  - Keep response short (2 to 3 sentences maximum, under 65 words), because your answer is read ALOUD through a speaker.
  - Plain farmer language (avoid abstract carbon trading jargon).
  - Facts: 70% direct payment to farmer via DBT/UPI. 3 milestone payouts (20% advance, 40% mid-crop, 40% harvest). ₹1,500 to ₹4,000 per acre.`;

      const formattedMessages = [
        { role: "system" as const, content: systemPrompt },
        ...history.slice(-4).map((h: any) => ({
          role: (h.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
          content: String(h.content || ""),
        })),
        { role: "user" as const, content: message },
      ];

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 220,
      });

      reply = completion.choices[0]?.message?.content || "";
    } catch (groqErr: any) {
      console.warn("Groq API call not available or key invalid, using smart local assistant fallback:", groqErr?.message);
      reply = getSmartFallbackReply(message, locale);
      provider = "local-assistant";
      isFallback = true;
    }

    if (!reply) {
      reply = getSmartFallbackReply(message, locale);
      provider = "local-assistant";
      isFallback = true;
    }

    return NextResponse.json({
      reply,
      provider,
      isFallback,
      locale,
    });
  } catch (error: any) {
    console.error("Error in /api/groq/chat:", error);
    return NextResponse.json(
      {
        reply: "नमस्ते किसान भाई, आवाज़ सेवा चालू है। आप जमीन, पराली या बैंक खाते के बारे में पूछ सकते हैं।",
        provider: "local-assistant",
        isFallback: true,
      },
      { status: 200 }
    );
  }
}
