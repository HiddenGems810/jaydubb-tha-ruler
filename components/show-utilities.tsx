"use client";

import { useRef, useState } from "react";
import {
  buildGoogleCalendarUrl,
  buildShowSharePayload,
  type ShareableShow,
} from "@/lib/show-utilities";

interface ShowUtilitiesProps {
  show: ShareableShow;
}

export function ShowUtilities({ show }: ShowUtilitiesProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setTemporaryStatus = (status: "copied" | "error") => {
    setShareStatus(status);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setShareStatus("idle"), 1800);
  };

  const copyFallback = async (text: string) => {
    if (!window.isSecureContext || !navigator.clipboard?.writeText) {
      setTemporaryStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setTemporaryStatus("copied");
    } catch {
      setTemporaryStatus("error");
    }
  };

  const shareShow = async () => {
    const payload = buildShowSharePayload(show);

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copyFallback(payload.text);
  };

  return (
    <div className="show-utilities" aria-label="Show utilities">
      <a
        href={buildGoogleCalendarUrl(show)}
        target="_blank"
        rel="noreferrer"
        data-fan-event="show_calendar_add"
      >
        Add to calendar
      </a>
      <span aria-hidden="true">/</span>
      <button type="button" onClick={shareShow} data-fan-event="show_share">
        {shareStatus === "copied"
          ? "Copied"
          : shareStatus === "error"
            ? "Copy unavailable"
            : "Share show"}
      </button>
      <span className="show-share-status" role="status" aria-live="polite">
        {shareStatus === "copied"
          ? "Show details copied to clipboard."
          : shareStatus === "error"
            ? "Copy is unavailable. Open the ticket link to share it manually."
            : ""}
      </span>
    </div>
  );
}
