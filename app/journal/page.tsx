import { JournalIndex } from "@/components/journal/journal-index";
import { getJournalIndexPage } from "@/lib/journal/queries";

export const revalidate = 60;

export default async function JournalPage() {
  const entries = await getJournalIndexPage();
  return <>
    <section className="journal-masthead"><div className="journal-masthead-top"><span>Independent archive</span><span>Colorado / Worldwide</span></div><h1><span>THE</span> JOURNAL</h1><p>Notes from the studio, the road, and everything between records.</p><div className="journal-rule"><span>Est. 2026</span><span>Scroll to enter</span></div></section>
    <JournalIndex entries={entries} />
  </>;
}
