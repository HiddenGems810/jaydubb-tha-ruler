import { createClient } from "@/lib/supabase/server";

export class AdminAuthError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message = status === 401 ? "Authentication required" : "Administrator access required",
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AdminAuthError(401);
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("id, role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    throw new AdminAuthError(403);
  }

  return { supabase, user, admin };
}

export function adminAuthErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  return null;
}
