import { apiError } from "@/lib/journal/admin";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireAdmin();
    const { data: source, error } = await supabase.from("journal_entries").select("slug,title,excerpt,entry_type,content,event_date,location,seo_title,seo_description").eq("id", id).single();
    if (error) throw error;
    const suffix = Date.now().toString(36);
    const { data, error: insertError } = await supabase.from("journal_entries").insert({ ...source, title: `${source.title} (Copy)`, slug: `${source.slug}-copy-${suffix}`, status: "draft", published_at: null, featured_at: null, created_by: user.id, updated_by: user.id }).select("id,slug").single();
    if (insertError) throw insertError;
    return Response.json({ entry: data }, { status: 201 });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
