"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn-secondary btn-sm"
      style={{
        width: "100%",
        marginTop: "0.5rem",
        color: "#f87171",
        borderColor: "rgba(239, 68, 68, 0.3)",
      }}
    >
      Sign Out
    </button>
  );
}
