import { JournalEditor } from "@/components/admin/journal/journal-editor";

export default function NewJournalEntryPage() {
  return <div><header className="admin-topbar journal-admin-topbar"><div><span className="metric-label">Journal</span><h1 className="admin-page-title">Create entry</h1><p>Create the draft first. Story blocks and media tools become available next.</p></div></header><div className="admin-content"><JournalEditor /></div></div>;
}
