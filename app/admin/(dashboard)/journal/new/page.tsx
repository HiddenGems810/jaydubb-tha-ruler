import { JournalEditor } from "@/components/admin/journal/journal-editor";

export default function NewJournalEntryPage() {
  return <div><header className="admin-topbar"><div><span className="metric-label">Journal / New</span><h1 className="admin-page-title">CREATE ENTRY</h1></div></header><div className="admin-content"><JournalEditor /></div></div>;
}
