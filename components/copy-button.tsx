"use client";

import { useRef, useState } from "react";

interface CopyButtonProps {
  value: string;
  label: string;
  eventName: string;
}

export function CopyButton({ value, label, eventName }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    if (!window.isSecureContext || !navigator.clipboard?.writeText) {
      setStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <span className="copy-control">
      <button type="button" onClick={copy} data-fan-event={eventName}>
        {status === "copied" ? "COPIED" : status === "error" ? "UNAVAILABLE" : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "copied"
          ? `${label} copied to clipboard.`
          : status === "error"
            ? "Clipboard access is unavailable. Select the text and copy it manually."
            : ""}
      </span>
    </span>
  );
}
