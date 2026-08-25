import { revalidatePath } from "next/cache";
import { apiError } from "@/lib/journal/admin";
import { JOURNAL_STATUSES } from "@/lib/journal/contracts";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as { status?: string; published_at?: string | null; featured?: boolean };
    if (!body.status || !JOURNAL_STATUSES.includes(body.status as never)) throw new Error("Invalid publication status");
    const { supabase, user } = await requireAdmin();
    const publishedAt = body.status === "published" ? (body.published_at || new Date().toISOString()) : body.status === "scheduled" ? body.published_at : null;
    if (body.status === "scheduled" && (!publishedAt || new Date(publishedAt) <= new Date())) throw new Error("Scheduled time must be in the future");
    const status = body.status as (typeof JOURNAL_STATUSES)[number];
    const { data, error } = await supabase.from("journal_entries").update({ status, published_at: publishedAt, featured_at: null, updated_by: user.id }).eq("id", id).select("id,slug,status,published_at").single();
    if (error) throw error;
    if (body.featured && body.status === "published") {
      const { error: featureError } = await supabase.rpc("set_featured_journal_entry", { target_id: id });
      if (featureError) throw featureError;
    }
    revalidatePath("/journal"); revalidatePath(`/journal/${data.slug}`); revalidatePath("/sitemap.xml");
    return Response.json({ entry: data });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
