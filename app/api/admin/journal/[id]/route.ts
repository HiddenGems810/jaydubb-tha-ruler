import { revalidatePath } from "next/cache";
import { apiError, parseJournalEntryPayload } from "@/lib/journal/admin";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const [entryResult, mediaResult] = await Promise.all([
      supabase.from("journal_entries").select("id,entry_number,slug,title,excerpt,entry_type,status,content,event_date,location,published_at,featured_at,cover_media_id,og_media_id,seo_title,seo_description,created_at,updated_at").eq("id", id).maybeSingle(),
      supabase.from("journal_media").select("id,entry_id,kind,mime_type,width,height,file_size_bytes,blur_data_url,alt_text,caption,credit,sort_order,created_at,updated_at").eq("entry_id", id).order("sort_order"),
    ]);
    if (entryResult.error || mediaResult.error) throw entryResult.error ?? mediaResult.error;
    if (!entryResult.data) return Response.json({ error: "Entry not found" }, { status: 404 });
    return Response.json({ entry: { ...entryResult.data, media: mediaResult.data ?? [] } });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { supabase, user } = await requireAdmin();
    const payload = parseJournalEntryPayload(await request.json(), true);
    const { data, error } = await supabase.from("journal_entries").update({ ...payload, updated_by: user.id }).eq("id", id).select("id,slug,status,updated_at").single();
    if (error) throw error;
    revalidatePath("/journal"); revalidatePath(`/journal/${data.slug}`); revalidatePath("/sitemap.xml");
    return Response.json({ entry: data });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const { data: media, error: mediaError } = await supabase.from("journal_media").select("storage_path").eq("entry_id", id);
    if (mediaError) throw mediaError;
    const { error } = await supabase.from("journal_entries").delete().eq("id", id);
    if (error) throw error;
    if (media?.length) {
      const { error: storageError } = await supabase.storage.from("journal-media").remove(media.map((item) => item.storage_path));
      if (storageError) console.error("Journal entry deleted but media cleanup needs retry", { entryId: id, code: storageError.name });
    }
    revalidatePath("/journal"); revalidatePath("/sitemap.xml");
    return new Response(null, { status: 204 });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
