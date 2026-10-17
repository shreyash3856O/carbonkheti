"use client";

import { useState } from "react";

interface VoiceButtonProps {
  textToSpeak: string;
  label?: string;
  lang?: string;
  className?: string;
  iconOnly?: boolean;
}

export default function VoiceButton({
  textToSpeak,
  label = "बोलकर सुनें",
  lang = "hi-IN",
  className = "",
  iconOnly = false,
}: VoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Voice playback is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 0.92; // Slightly measured rate for better clarity
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      title={isSpeaking ? "आवाज़ रोकें (Stop audio)" : "बोलकर सुनें (Listen to text)"}
      className={`inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
        isSpeaking
          ? "bg-stone-900 text-white font-semibold shadow-sm"
          : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
      } ${
        iconOnly
          ? "w-8 h-8 rounded-full"
          : "px-2.5 py-1 rounded-full text-xs font-medium"
      } ${className}`}
    >
      {isSpeaking ? (
        <span className="flex items-center gap-0.5 h-3">
          <span className="w-1 bg-stone-950 rounded-full voice-wave" style={{ animationDelay: "0ms" }} />
          <span className="w-1 bg-stone-950 rounded-full voice-wave" style={{ animationDelay: "200ms" }} />
          <span className="w-1 bg-stone-950 rounded-full voice-wave" style={{ animationDelay: "400ms" }} />
        </span>
      ) : (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
      {!iconOnly && <span>{isSpeaking ? "रोकें (Stop)" : label}</span>}
    </button>
  );
}
