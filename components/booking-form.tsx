"use client";

import { useState } from "react";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiry_type: "booking",
    event_date: "",
    location: "",
    budget_range: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          organization: "",
          inquiry_type: "booking",
          event_date: "",
          location: "",
          budget_range: "",
          message: "",
          honeypot: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Unable to send inquiry. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="inquiry-success-box" role="status" aria-live="polite">
        <h4>INQUIRY RECEIVED</h4>
        <p>
          Thank you for contacting JayDubb Tha Ruler&apos;s team. We will review your request and reply shortly.
        </p>
        <button
          type="button"
          className="button button-ghost"
          onClick={() => setStatus("idle")}
          style={{ marginTop: "1rem" }}
        >
          SEND ANOTHER MESSAGE <Arrow />
        </button>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="inquiry-name">Your Name *</label>
          <input
            id="inquiry-name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Justin Wallace"
          />
        </div>
        <div className="form-group">
          <label htmlFor="inquiry-email">Email Address *</label>
          <input
            id="inquiry-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="management@example.com"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="inquiry-type">Inquiry Type</label>
          <select id="inquiry-type" name="inquiry_type" value={formData.inquiry_type} onChange={handleChange}>
            <option value="booking">Live Performance / Concert</option>
            <option value="press">Press / Media Interview</option>
            <option value="features">Music Collaboration / Feature</option>
            <option value="sponsorship">Brand Sponsorship / Licensing</option>
            <option value="general">General Inquiries</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="inquiry-org">Organization / Venue</label>
          <input
            id="inquiry-org"
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Venue, Agency or Publication"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="inquiry-date">Target Date (Optional)</label>
          <input
            id="inquiry-date"
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inquiry-location">Location / City</label>
          <input
            id="inquiry-location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Denver, CO"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="inquiry-message">Details &amp; Budget Range *</label>
        <textarea
          id="inquiry-message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe the event, venue capacity, proposed compensation/budget, and schedule details."
        />
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}

      <div>
        <button
          type="submit"
          className="button button-primary"
          disabled={status === "loading"}
          data-fan-event="booking_inquiry_submit"
        >
          {status === "loading" ? "SUBMITTING..." : "SUBMIT INQUIRY"} <Arrow />
        </button>
      </div>
    </form>
  );
}
