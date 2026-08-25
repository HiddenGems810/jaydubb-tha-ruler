import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID.test(id)) return new Response("Not found", { status: 404 });

  const publicClient = await createClient();
  const { data: media, error } = await publicClient
    .from("journal_media")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (error || !media) return new Response("Not found", { status: 404 });

  const { data, error: signError } = await createAdminClient().storage
    .from("journal-media")
    .createSignedUrl(media.storage_path, 300);

  if (signError || !data?.signedUrl) {
    console.error("Unable to sign Journal media", { mediaId: id, code: signError?.name });
    return new Response("Media unavailable", { status: 503 });
  }

  return NextResponse.redirect(data.signedUrl, {
    status: 307,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
