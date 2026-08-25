import { apiError } from "@/lib/journal/admin";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as { ids?: string[] };
    if (!Array.isArray(body.ids) || body.ids.length === 0) throw new Error("A complete media order is required");
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.rpc("reorder_journal_media", { target_entry_id: id, ordered_ids: body.ids });
    if (error) throw error;
    return Response.json({ media: data });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
