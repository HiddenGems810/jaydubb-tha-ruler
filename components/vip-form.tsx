"use client";

import { useState } from "react";

export function VipForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/vip-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          honeypot: honeypot || undefined,
          source: "homepage_vip_section",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "You're in. Welcome to The 7 VIP Fan Club.");
        setEmail("");
        setFirstName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Unable to join at this time. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please check your network and try again.");
    }
  }

  return (
    <form className="vip-form" onSubmit={handleSubmit}>
      {status === "success" ? (
        <div className="vip-success-message" role="status" aria-live="polite">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p>{message}</p>
        </div>
      ) : (
        <>
          <div className="vip-input-wrap">
            {/* Honeypot field for bot protection */}
            <input
              type="text"
              name="hp_field"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <label htmlFor="vip-email" className="sr-only">Email address</label>
            <input
              id="vip-email"
              type="email"
              placeholder="ENTER YOUR EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
              autoComplete="email"
            />
            <button
              type="submit"
              className="button-primary"
              disabled={status === "loading"}
              data-fan-event="vip_signup"
              data-platform="vip_club"
            >
              {status === "loading" ? "JOINING..." : "JOIN THE 7"}
            </button>
          </div>
          {status === "error" && (
            <p className="vip-error-message" role="alert">
              {message}
            </p>
          )}
          <p className="vip-disclaimer">
            Direct access to JayDubb Tha Ruler announcements. Unsubscribe anytime. No spam.
          </p>
        </>
      )}
    </form>
  );
}
