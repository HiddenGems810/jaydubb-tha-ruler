import { apiError } from "@/lib/journal/admin";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

const text = (value: unknown, max: number) => value === null || value === "" ? null : typeof value === "string" && value.trim().length <= max ? value.trim() : (() => { throw new Error(`Text must be ${max} characters or fewer`); })();

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string; mediaId: string }> }) {
  try {
    const { id, mediaId } = await params;
    const body = await request.json() as Record<string, unknown>;
    const update: { alt_text?: string | null; caption?: string | null; credit?: string | null } = {};
    if ("alt_text" in body) update.alt_text = text(body.alt_text, 500);
    if ("caption" in body) update.caption = text(body.caption, 1000);
    if ("credit" in body) update.credit = text(body.credit, 300);
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("journal_media").update(update).eq("id", mediaId).eq("entry_id", id).select("id,alt_text,caption,credit,sort_order").single();
    if (error) throw error;
    return Response.json({ media: data });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; mediaId: string }> }) {
  try {
    const { id, mediaId } = await params;
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("journal_media").select("storage_path").eq("id", mediaId).eq("entry_id", id).single();
    if (error) throw error;
    const { error: deleteError } = await supabase.from("journal_media").delete().eq("id", mediaId).eq("entry_id", id);
    if (deleteError) throw deleteError;
    const { error: storageError } = await supabase.storage.from("journal-media").remove([data.storage_path]);
    if (storageError) console.error("Journal media metadata deleted but object cleanup needs retry", { mediaId, code: storageError.name });
    return new Response(null, { status: 204 });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
