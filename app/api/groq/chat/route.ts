import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const DEFAULT_GROQ_API_KEY = process.env.GROQ_API_KEY || "";

// Smart rural knowledge base for instant local fallback if Groq key is inactive or offline
function getSmartFallbackReply(userMsg: string, locale: string = "hi"): string {
  const q = userMsg.toLowerCase();

  if (q.includes("कितना") || q.includes("पैसा") || q.includes("कमाई") || q.includes("earn") || q.includes("price") || q.includes("रुपय") || q.includes("रुपया")) {
    return "किसान भाई, कार्बनखेती से आप हर एकड़ जमीन पर सालाना ₹1,500 से ₹4,000 तक सीधे अपने बैंक खाते में कमा सकते हैं। 70% पैसा सीधे आपके खाते में 3 किस्तों (20% शुरू में, 40% फसल के बीच, और 40% कटाई के बाद) में ट्रांसफर किया जाता है।";
  }

  if (q.includes("पराली") || q.includes("stubble") || q.includes("जलाना") || q.includes("burn")) {
    return "धान की पराली को जलाने के बजाय खेत में मिलाने या बायोचार बनाने पर प्रदूषण नहीं होता और आपको प्रति एकड़ 2.5 टन तक कार्बन क्रेडिट मिलता है, जिससे लगभग ₹3,500 तक अतिरिक्त आमदनी होती है।";
  }

  if (q.includes("फोटो") || q.includes("proof") || q.includes("photo") || q.includes("तस्वीर") || q.includes("अपलोड")) {
    return "खेत की तस्वीर भेजना बहुत आसान है! किसान पासबुक पेज पर जाकर 'खेत का फोटो' विकल्प चुनें। अपने मोबाइल कैमरे से फसल और खेत की फोटो खींचें, आपकी लोकेशन अपने आप दर्ज हो जाएगी और ऑडिट के लिए सुरक्षित जमा हो जाएगी।";
  }

  if (q.includes("बैंक") || q.includes("खाता") || q.includes("dbt") || q.includes("account") || q.includes("transfer") || q.includes("upi")) {
    return "पैसे सीधे आपके आधार से जुड़े बैंक खाते या UPI में डायरेक्ट बेनिफिट ट्रांसफर (DBT) के ज़रिये आते हैं। बिचौलियों का कोई चक्कर नहीं है, सरकार और CCTS नियमों के तहत पूरा हिसाब पासबुक में दिखता है।";
  }

  if (q.includes("शून्य") || q.includes("जुताई") || q.includes("zero till") || q.includes("tillage")) {
    return "शून्य जुताई (Zero Tillage) करने से मिट्टी में नमी बनी रहती है, डीजल का खर्च बचता है और जमीन में कार्बन सुरक्षित रहता है। इस पद्धति पर आपको कार्बन क्रेडिट का सबसे अच्छा रेट मिलता है।";
  }

  if (locale === "gu" || q.includes("રૂપિયા") || q.includes("ખેતી")) {
    return "ખેડૂત મિત્ર, કાર્બનખેતી દ્વારા તમે દર એકરે વાર્ષિક ₹1,500 થી ₹4,000 સીધા તમારા બેંક ખાતામાં મેળવી શકો છો. 70% રકમ સીધી તમારા બેંક ખાતામાં જમા થાય છે.";
  }

  if (locale === "en" || q.includes("carbon") || q.includes("how") || q.includes("what")) {
    return "Welcome to CarbonKheti! Farmers earn ₹1,500 to ₹4,000 per acre every year by adopting eco-friendly farming like no-till, biochar, and zero stubble burning. 70% of credit proceeds are directly transferred to your bank account via DBT.";
  }

  return "नमस्ते किसान भाई! मैं कार्बनखेती का आवाज़ साथी (किसान मित्र) हूँ। आप मुझसे पूछ सकते हैं कि आपकी जमीन पर कितनी कमाई होगी, पराली न जलाने पर क्या लाभ मिलेगा, या बैंक में पैसे कैसे आएंगे!";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], locale = "hi", apiKey } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const keyToUse = apiKey && apiKey.trim().length > 10 ? apiKey.trim() : DEFAULT_GROQ_API_KEY;

    let reply = "";
    let provider = "groq";
    let isFallback = false;

    try {
      const groq = new Groq({ apiKey: keyToUse });

      const systemPrompt = `You are "Kisan Mitra" (किसान मित्र / CarbonKheti Sahayak), an empathetic, cheerful, and simple agricultural voice assistant for Indian farmers.
Language instruction:
- If the user talks in Hindi or asks in Hindi, answer in clear, simple Hindi (Devanagari script).
- If the user asks in Gujarati, answer in simple Gujarati.
- If the user asks in Marathi, answer in simple Marathi.
- If the user asks in English or mixed Hinglish, reply warmly in clear simple terms.
Tone and Length:
- Keep the response short (2 to 3 sentences maximum, under 65 words), because your answer will be read ALOUD through a speaker.
- Avoid technical carbon finance jargon (do not say "MRV cadastral registry" or "cryptographic tokens"). Use plain farmer terms like "खेत की तस्वीर", "सीधे बैंक खाते में पैसा", "पराली प्रबंधन", "हर एकड़ पर ₹1,500 से ₹4,000".
- CarbonKheti core facts: 70% of credit value goes directly to farmer bank account via DBT/UPI. 3 installments (20% advance, 40% mid-crop, 40% after harvest).`;

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
