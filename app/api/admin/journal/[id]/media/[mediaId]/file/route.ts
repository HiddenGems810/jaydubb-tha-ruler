import { NextResponse } from "next/server";
import { apiError } from "@/lib/journal/admin";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; mediaId: string }> }) {
  try {
    const { id, mediaId } = await params;
    const { supabase } = await requireAdmin();
    const { data: media, error } = await supabase.from("journal_media").select("storage_path").eq("entry_id", id).eq("id", mediaId).single();
    if (error) throw error;
    const { data, error: signError } = await supabase.storage.from("journal-media").createSignedUrl(media.storage_path, 120);
    if (signError || !data) throw signError ?? new Error("Unable to sign media URL");
    return NextResponse.redirect(data.signedUrl, { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
