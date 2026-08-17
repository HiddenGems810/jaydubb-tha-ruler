"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Inquiry = Database["public"]["Tables"]["booking_inquiries"]["Row"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("booking_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (isMounted) {
          if (data) setInquiries(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  function handleSelectInquiry(inq: Inquiry) {
    setSelectedInquiry(inq);
    setAdminNotes(inq.admin_notes || "");
  }

  async function handleUpdateStatus(inq: Inquiry, newStatus: Database["public"]["Enums"]["inquiry_status"]) {
    const { error } = await supabase
      .from("booking_inquiries")
      .update({ status: newStatus })
      .eq("id", inq.id);

    if (!error) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === inq.id ? { ...i, status: newStatus } : i))
      );
      if (selectedInquiry?.id === inq.id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    }
  }

  async function handleSaveNotes() {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from("booking_inquiries")
      .update({ admin_notes: adminNotes })
      .eq("id", selectedInquiry.id);

    if (!error) {
      setSelectedInquiry({ ...selectedInquiry, admin_notes: adminNotes });
      setInquiries((prev) =>
        prev.map((i) => (i.id === selectedInquiry.id ? { ...i, admin_notes: adminNotes } : i))
      );
    }
    setSavingNotes(false);
  }

  async function handleDelete(inq: Inquiry) {
    if (!confirm(`Delete inquiry from "${inq.name}"?`)) return;
    const { error } = await supabase.from("booking_inquiries").delete().eq("id", inq.id);
    if (!error) {
      setInquiries((prev) => prev.filter((i) => i.id !== inq.id));
      if (selectedInquiry?.id === inq.id) setSelectedInquiry(null);
    }
  }

  const filteredInquiries = inquiries.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">BOOKING &amp; BUSINESS INQUIRIES</h1>
        <div className="admin-topbar-actions">
          <span className="admin-badge">{inquiries.length} Total Submissions</span>
        </div>
      </header>

      <div className="admin-content">
        <div style={{ display: "grid", gridTemplateColumns: selectedInquiry ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
          {/* List Table */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-actions">
                <select
                  className="admin-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Inquiries ({inquiries.length})</option>
                  <option value="new">New</option>
                  <option value="in_review">In Review</option>
                  <option value="responded">Responded</option>
                  <option value="booked">Booked</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="admin-table-container">
              {loading ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#8c8c87" }}>
                  Loading inquiries...
                </div>
              ) : filteredInquiries.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inq) => (
                      <tr
                        key={inq.id}
                        onClick={() => handleSelectInquiry(inq)}
                        style={{
                          cursor: "pointer",
                          background: selectedInquiry?.id === inq.id ? "#1a1b22" : undefined,
                        }}
                      >
                        <td>
                          <strong>{inq.name}</strong>
                          <div style={{ fontSize: "0.72rem", color: "#8c8c87" }}>{inq.email}</div>
                        </td>
                        <td style={{ textTransform: "capitalize" }}>{inq.inquiry_type}</td>
                        <td>
                          <span className={`status-badge ${inq.status}`}>{inq.status}</span>
                        </td>
                        <td>{new Date(inq.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="admin-empty-state">
                  <h3>No Inquiries Found</h3>
                  <p>Client booking submissions from the website contact forms will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Detail View */}
          {selectedInquiry && (
            <div className="admin-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.25rem", fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
                    {selectedInquiry.name}
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "#c1121f" }}>
                    <a href={`mailto:${selectedInquiry.email}`} style={{ color: "inherit" }}>
                      {selectedInquiry.email} ↗
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Close
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem", fontSize: "0.8rem" }}>
                <div>
                  <span style={{ color: "#8c8c87", display: "block" }}>ORGANIZATION:</span>
                  <strong>{selectedInquiry.organization || "Independent"}</strong>
                </div>
                <div>
                  <span style={{ color: "#8c8c87", display: "block" }}>TYPE:</span>
                  <strong style={{ textTransform: "capitalize" }}>{selectedInquiry.inquiry_type}</strong>
                </div>
                <div>
                  <span style={{ color: "#8c8c87", display: "block" }}>EVENT DATE:</span>
                  <strong>{selectedInquiry.event_date || "Flexible"}</strong>
                </div>
                <div>
                  <span style={{ color: "#8c8c87", display: "block" }}>LOCATION:</span>
                  <strong>{selectedInquiry.location || "TBD"}</strong>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ color: "#8c8c87", display: "block", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                  MESSAGE / PROPOSAL:
                </span>
                <div style={{ background: "#0a0b0e", padding: "1rem", border: "1px solid #23242a", fontSize: "0.85rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status Update Action Bar */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ color: "#8c8c87", display: "block", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                  UPDATE STATUS:
                </span>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {(["new", "in_review", "responded", "booked", "archived"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn btn-sm ${selectedInquiry.status === st ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => handleUpdateStatus(selectedInquiry, st)}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div>
                <span style={{ color: "#8c8c87", display: "block", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                  INTERNAL MANAGEMENT NOTES:
                </span>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Notes for JayDubb management, fee negotiations, rider agreements..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(selectedInquiry)}
                  >
                    Delete Inquiry
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
