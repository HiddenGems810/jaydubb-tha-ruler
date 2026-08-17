import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, inquiry_type, event_date, location, budget_range, message, honeypot } = body;

    // Bot honeypot protection
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Inquiry received." });
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Please provide your name." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Please enter your message or inquiry details." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error: insertError } = await supabase.from("booking_inquiries").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      organization: organization?.trim() || null,
      inquiry_type: inquiry_type || "booking",
      event_date: event_date || null,
      location: location?.trim() || null,
      budget_range: budget_range?.trim() || null,
      message: message.trim(),
      status: "new",
    });

    if (insertError) {
      console.error("Booking inquiry insert error:", insertError.message);
      return NextResponse.json(
        { success: false, error: "Unable to submit inquiry. Please try again or email directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you. Your inquiry has been received by JayDubb's management team.",
    });
  } catch (err) {
    console.error("Inquiry handler error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
