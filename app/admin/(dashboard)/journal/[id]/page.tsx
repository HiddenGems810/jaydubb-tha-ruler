import { JournalEditor } from "@/components/admin/journal/journal-editor";

export default async function EditJournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div><header className="admin-topbar"><div><span className="metric-label">Journal / Edit</span><h1 className="admin-page-title">EDIT ENTRY</h1></div></header><div className="admin-content"><JournalEditor entryId={id} /></div></div>;
}
