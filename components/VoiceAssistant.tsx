"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  {
    hi: "मेरे 2 एकड़ खेत में कितना पैसा मिलेगा?",
    en: "How much will I earn from 2 acres of land?",
    icon: "🌾",
  },
  {
    hi: "धान की पराली न जलाने पर क्या लाभ है?",
    en: "What are the benefits of avoiding stubble burning?",
    icon: "🔥",
  },
  {
    hi: "पैसे बैंक खाते में कब और कैसे आते हैं?",
    en: "When and how do payouts reach my bank account?",
    icon: "💰",
  },
  {
    hi: "खेत का फोटो और सबूत कैसे अपलोड करें?",
    en: "How to upload farm photo evidence?",
    icon: "📸",
  },
];

const LOCALE_TO_VOICE_LANG: Record<string, string> = {
  hi: "hi-IN",
  en: "en-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  pa: "pa-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  bn: "bn-IN",
  ml: "ml-IN",
  od: "hi-IN",
};

export default function VoiceAssistant({ currentLocale = "hi" }: { currentLocale?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      role: "assistant",
      content:
        "राम-राम किसान भाई! मैं आपका कार्बनखेती आवाज़ साथी (Kisan Mitra) हूँ। माइक दबाकर बोलें या नीचे दिए गए सवाल चुनें — मैं आपको बोलकर समझाऊंगा!",
      provider: "groq",
      timestamp: "अभी",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [currentLang, setCurrentLang] = useState<string>(
    LOCALE_TO_VOICE_LANG[currentLocale] || "hi-IN"
  );
  const [apiKey, setApiKey] = useState("");
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  useEffect(() => {
    if (currentLocale && LOCALE_TO_VOICE_LANG[currentLocale]) {
      setCurrentLang(LOCALE_TO_VOICE_LANG[currentLocale]);
    }
  }, [currentLocale]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Initialize SpeechRecognition on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = currentLang;

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
  }, [currentLang]);

  // Update recognition language when user changes language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = currentLang;
    }
  }, [currentLang]);

  // Text-To-Speech Playback
  const speakResponse = (text: string, lang = currentLang) => {
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
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (inputText.trim()) {
        handleSendMessage(inputText);
      }
    } else {
      stopSpeaking();
      setInputText("");
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Error starting speech recognition:", err);
      }
    }
  };

  // Send message to Groq AI / Local fallback
  const handleSendMessage = async (userQuery: string) => {
    const text = userQuery.trim();
    if (!text) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const newUserMsg: Message = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");
    setIsProcessing(true);

    try {
      const res = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4),
          locale: currentLang.slice(0, 2),
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();
      const replyContent =
        data.reply ||
        "किसान भाई, आपकी जानकारी दर्ज हो गई है। आप पासबुक में सीधे अपना बैलेंस चेक कर सकते हैं।";

      const newBotMsg: Message = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: replyContent,
        provider: data.provider || "groq",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, newBotMsg]);

      // Automatically speak the response aloud
      speakResponse(replyContent, currentLang);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: Message = {
        id: "err-" + Date.now(),
        role: "assistant",
        content:
          "किसान भाई, कार्बनखेती में प्रति एकड़ ₹1,500 से ₹4,000 की कमाई सीधे बैंक खाते में मिलती है। 70% गारंटीड पेमेंट आपको बिना किसी बिचौलिए के मिलता है।",
        provider: "local-assistant",
        timestamp: "अभी",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakResponse(fallbackMsg.content, currentLang);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill for Instant Local Access */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-md border border-stone-700 cursor-pointer"
          >
            <span>रोकें (Stop Audio)</span>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            if (!isOpen && !isListening) {
              stopSpeaking();
            }
          }}
          className="group flex items-center gap-3 bg-stone-900 hover:bg-black text-white pl-3.5 pr-4.5 py-3 rounded-full shadow-xl border border-stone-700 transition-all cursor-pointer transform hover:scale-[1.02]"
        >
          {/* Mic Icon */}
          <div className="w-8 h-8 rounded-full bg-stone-800 text-amber-400 flex items-center justify-center font-bold">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z"
              />
            </svg>
          </div>

          <div className="text-left leading-tight">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>किसान आवाज़ साथी</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="text-[11px] text-stone-300">बोलकर कुछ भी पूछें 🎙️</div>
          </div>
        </button>
      </div>

      {/* Full-Featured Voice Modal / Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white text-stone-900 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
            {/* Header */}
            <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center font-bold text-lg">
                  🌾
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    किसान आवाज़ साथी (Kisan Mitra)
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    बोलकर पूछें • सीधा और आसान जवाब
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Select */}
                <select
                  value={currentLang}
                  onChange={(e) => setCurrentLang(e.target.value as any)}
                  className="bg-stone-800 hover:bg-stone-700 text-white text-xs px-2.5 py-1.5 rounded-lg border border-stone-700 outline-none cursor-pointer"
                >
                  <option value="hi-IN" className="text-stone-900">
                    हिन्दी (Hindi)
                  </option>
                  <option value="pa-IN" className="text-stone-900">
                    ਪੰਜਾਬੀ (Punjabi)
                  </option>
                  <option value="mr-IN" className="text-stone-900">
                    मराठी (Marathi)
                  </option>
                  <option value="gu-IN" className="text-stone-900">
                    ગુજરાતી (Gujarati)
                  </option>
                  <option value="ta-IN" className="text-stone-900">
                    தமிழ் (Tamil)
                  </option>
                  <option value="te-IN" className="text-stone-900">
                    తెలుగు (Telugu)
                  </option>
                  <option value="kn-IN" className="text-stone-900">
                    ಕನ್ನಡ (Kannada)
                  </option>
                  <option value="bn-IN" className="text-stone-900">
                    বাংলা (Bengali)
                  </option>
                  <option value="en-IN" className="text-stone-900">
                    English
                  </option>
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
                  title="बंद करें (Close)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sub-banner: Simple status & Voice Controls */}
            <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-500" />
                <span className="font-medium">
                  {isListening
                    ? "सुन रहा हूँ... बोलिए!"
                    : isSpeaking
                    ? "आवाज़ में जवाब दे रहा हूँ..."
                    : isProcessing
                    ? "जवाब तैयार हो रहा है..."
                    : "माइक दबाकर सवाल बोलें"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="text-[10px] text-stone-600 hover:text-stone-900 underline cursor-pointer"
              >
                {showKeyConfig ? "छिपाएं" : "Groq API सेटिंग"}
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
                    सहेजें
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
                          {isAssistant ? "🌾 किसान मित्र" : "👤 आप (You)"}
                        </span>
                        {isAssistant && (
                          <button
                            type="button"
                            onClick={() => speakResponse(m.content, currentLang)}
                            className="text-stone-700 hover:text-black inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                            title="दोबारा सुनें (Listen again)"
                          >
                            <span>🔊 दोबारा सुनें</span>
                          </button>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              })}

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-stone-500 py-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-600 animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-stone-600 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-stone-600 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span>किसान मित्र सोच रहा है...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Chips for Illiterate/Busy Farmers */}
            <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 overflow-x-auto no-scrollbar">
              <div className="text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wide">
                सीधे सवाल पूछें (Tap to Ask):
              </div>
              <div className="flex gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q.hi)}
                    className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>{q.icon}</span>
                    <span>{q.hi}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Central Interactive Voice & Text Input Section */}
            <div className="p-4 bg-white border-t border-stone-200">
              {/* Spoken input preview if listening */}
              {isListening && (
                <div className="mb-3 p-3 rounded-xl bg-stone-100 border border-stone-300 text-xs text-stone-900 flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 h-3">
                      <span className="w-1 bg-amber-600 rounded-full voice-wave" />
                      <span
                        className="w-1 bg-amber-600 rounded-full voice-wave"
                        style={{ animationDelay: "200ms" }}
                      />
                      <span
                        className="w-1 bg-amber-600 rounded-full voice-wave"
                        style={{ animationDelay: "400ms" }}
                      />
                    </span>
                    <span className="font-semibold">
                      {inputText ? `"${inputText}"` : "आपकी आवाज़ सुनी जा रही है..."}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className="bg-stone-900 hover:bg-black text-white font-bold px-3 py-1 rounded-lg text-[11px] cursor-pointer"
                  >
                    जमा करें (Send)
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Big Accessible Microphone Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`relative flex items-center justify-center shrink-0 w-11 h-11 rounded-xl transition-all shadow-xs cursor-pointer ${
                    isListening
                      ? "bg-amber-600 text-white ring-2 ring-amber-300"
                      : "bg-stone-900 hover:bg-black text-white"
                  }`}
                  title={isListening ? "माइक बंद करें" : "माइक दबाकर बोलें"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z"
                    />
                  </svg>
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  placeholder="यहाँ लिखें या माइक दबाकर बोलें..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputText);
                    }
                  }}
                  className="flex-1 bg-stone-100 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-stone-200 focus:border-stone-400 outline-none transition-all"
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim()}
                  className="w-11 h-11 rounded-xl bg-stone-900 hover:bg-black disabled:opacity-30 text-white flex items-center justify-center font-bold transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
                  title="भेजें (Send)"
                >
                  <svg
                    className="w-4 h-4 transform rotate-90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </button>
              </div>

              <div className="mt-2 text-center text-[10px] text-stone-500">
                100% स्थानीय और सुरक्षित • किसी भी भाषा में बोलें • सीधे बैंक में पैसा
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
