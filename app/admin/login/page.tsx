"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Verify admin membership
        const { data: adminRecord } = await supabase
          .from("admin_users")
          .select("id, role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!adminRecord) {
          await supabase.auth.signOut();
          setError("Access Denied: Your account does not have CMS administrative privileges.");
          setLoading(false);
          return;
        }

        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Unable to authenticate. Please check your credentials.");
    }
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (otpError) {
      setError(otpError.message);
    } else {
      setMagicLinkSent(true);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08090b", padding: "1.5rem" }}>
      <div style={{ width: "min(28rem, 100%)", background: "#111216", border: "1px solid #1f2024", padding: "2.5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", color: "#f5f5f2" }}>
            JAYDUBB
          </h1>
          <span className="admin-badge" style={{ marginTop: "0.5rem" }}>
            ADMINISTRATION HUB
          </span>
        </div>

        {magicLinkSent ? (
          <div style={{ textAlign: "center", padding: "1rem", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: "1.5" }}>
              Magic link sent to <strong>{email}</strong>. Check your inbox to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordLogin}>
            {error && (
              <div style={{ padding: "0.75rem", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                {error}
              </div>
            )}

            <div className="form-field" style={{ marginBottom: "1rem" }}>
              <label>Admin Email</label>
              <input
                type="email"
                required
                className="admin-input"
                placeholder="admin@jaydubbtharuler.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-field" style={{ marginBottom: "1.5rem" }}>
              <label>Password</label>
              <input
                type="password"
                required
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.85rem" }}
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN TO CMS →"}
            </button>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ width: "100%" }}
                onClick={handleMagicLink}
                disabled={loading}
              >
                Send Magic Link Instead
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #1f2024", textAlign: "center", fontSize: "0.7rem", color: "#8c8c87" }}>
          PROTECTED · SUPABASE AUTH &amp; POSTGRES RLS
        </div>
      </div>
    </div>
  );
}
