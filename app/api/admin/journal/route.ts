import { apiError, parseJournalEntryPayload } from "@/lib/journal/admin";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("journal_entries").select("id,entry_number,slug,title,entry_type,status,published_at,featured_at,updated_at").order("updated_at", { ascending: false });
    if (error) throw error;
    return Response.json({ entries: data ?? [] });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    const payload = parseJournalEntryPayload(await request.json());
    const { data, error } = await supabase.from("journal_entries").insert({ ...payload, status: "draft", created_by: user.id, updated_by: user.id }).select("id,slug").single();
    if (error) throw error;
    return Response.json({ entry: data }, { status: 201 });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
