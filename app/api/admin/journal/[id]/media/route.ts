import { randomUUID } from "node:crypto";
import { apiError } from "@/lib/journal/admin";
import { adminAuthErrorResponse, requireAdmin } from "@/lib/supabase/require-admin";

const MIME_EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "video/mp4": "mp4" };
const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    if (files.length === 0 || files.length > 20) throw new Error("Upload between 1 and 20 files");
    for (const file of files) {
      if (!MIME_EXTENSIONS[file.type] || file.size <= 0 || file.size > MAX_BYTES) {
        throw new Error(`Unsupported or oversized file: ${file.name}`);
      }
    }
    const { count, error: countError } = await supabase.from("journal_media").select("id", { count: "exact", head: true }).eq("entry_id", id);
    if (countError) throw countError;
    const created = [];
    const createdPaths: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        const extension = MIME_EXTENSIONS[file.type];
        const path = `${id}/${randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("journal-media").upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) throw uploadError;
        createdPaths.push(path);
        const altText = file.type.startsWith("image/") ? String(formData.get(`alt_${index}`) ?? "").trim() || null : null;
        const { data, error } = await supabase.from("journal_media").insert({ entry_id: id, storage_path: path, kind: file.type === "video/mp4" ? "video" : "image", mime_type: file.type, file_size_bytes: file.size, alt_text: altText, sort_order: (count ?? 0) + index }).select("id,entry_id,kind,mime_type,width,height,file_size_bytes,blur_data_url,alt_text,caption,credit,sort_order,created_at,updated_at").single();
        if (error) throw error;
        created.push(data);
      }
    } catch (error) {
      if (created.length) await supabase.from("journal_media").delete().in("id", created.map((item) => item.id));
      if (createdPaths.length) await supabase.storage.from("journal-media").remove(createdPaths);
      throw error;
    }
    return Response.json({ media: created }, { status: 201 });
  } catch (error) { return adminAuthErrorResponse(error) ?? apiError(error); }
}
