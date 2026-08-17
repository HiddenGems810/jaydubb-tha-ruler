import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, honeypot, source, utm_source, utm_medium, utm_campaign } = body;

    // Honeypot spam protection
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Welcome to The 7 VIP Fan Club." });
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = createAdminClient();

    // Check existing record
    const { data: existingMember } = await supabase
      .from("vip_members")
      .select("id, status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingMember) {
      if (existingMember.status === "active") {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed to The 7 VIP Fan Club!",
          alreadyMember: true,
        });
      }

      // Re-activate member
      const { error: updateError } = await supabase
        .from("vip_members")
        .update({
          status: "active",
          consent_at: new Date().toISOString(),
          unsubscribed_at: null,
          first_name: firstName?.trim() || null,
        })
        .eq("id", existingMember.id);

      if (updateError) {
        console.error("VIP reactivation error:", updateError.message);
        return NextResponse.json(
          { success: false, error: "Unable to update subscription. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Welcome back! Your VIP Fan Club subscription has been reactivated.",
      });
    }

    // Insert new member
    const { error: insertError } = await supabase.from("vip_members").insert({
      email: normalizedEmail,
      first_name: firstName?.trim() || null,
      source: source || "website_vip_section",
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      status: "active",
      consent_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("VIP signup insert error:", insertError.message);
      return NextResponse.json(
        { success: false, error: "Unable to complete VIP registration. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You're in. Welcome to The 7 VIP Fan Club.",
    });
  } catch (err) {
    console.error("VIP signup handler error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
