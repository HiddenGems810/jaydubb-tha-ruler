import Link from "next/link";
import { JournalList, type JournalListItem } from "@/components/admin/journal/journal-list";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("journal_entries").select("id,entry_number,slug,title,entry_type,status,published_at,featured_at,updated_at").order("updated_at", { ascending: false });
  return <div><header className="admin-topbar"><div><span className="metric-label">Publishing desk</span><h1 className="admin-page-title">JOURNAL / JOURNEY</h1></div><div className="admin-topbar-actions"><Link href="/journal" target="_blank" className="btn btn-secondary btn-sm">View archive ↗</Link><Link href="/admin/journal/new" className="btn btn-primary btn-sm">+ New entry</Link></div></header><div className="admin-content">{error ? <div className="journal-admin-error">Journal tables are not available. Apply the additive migration before publishing.</div> : <JournalList initialEntries={(data ?? []) as JournalListItem[]} />}</div></div>;
}
