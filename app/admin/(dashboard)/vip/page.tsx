"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type VipMember = Database["public"]["Tables"]["vip_members"]["Row"];

export default function AdminVipPage() {
  const [members, setMembers] = useState<VipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("vip_members")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (isMounted) {
          if (!error && data) setMembers(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleToggleStatus(member: VipMember) {
    const newStatus = member.status === "active" ? "unsubscribed" : "active";
    const { error } = await supabase
      .from("vip_members")
      .update({
        status: newStatus,
        unsubscribed_at: newStatus === "unsubscribed" ? new Date().toISOString() : null,
      })
      .eq("id", member.id);

    if (!error) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m))
      );
    }
  }

  async function handleDeleteMember(member: VipMember) {
    if (!confirm(`Permanently delete fan record "${member.email}"?`)) {
      return;
    }

    const { error } = await supabase.from("vip_members").delete().eq("id", member.id);
    if (!error) {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    }
  }

  function handleExportCsv() {
    if (members.length === 0) {
      alert("No members to export.");
      return;
    }

    const headers = ["ID", "Email", "First Name", "Status", "Source", "UTM Source", "UTM Medium", "UTM Campaign", "Consent Timestamp", "Created At"];
    const rows = members.map((m) => [
      `"${m.id}"`,
      `"${m.email}"`,
      `"${m.first_name || ""}"`,
      `"${m.status}"`,
      `"${m.source}"`,
      `"${m.utm_source || ""}"`,
      `"${m.utm_medium || ""}"`,
      `"${m.utm_campaign || ""}"`,
      `"${m.consent_at}"`,
      `"${m.created_at}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `jaydubb_vip_fans_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredMembers = members.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        m.email.toLowerCase().includes(term) ||
        (m.first_name && m.first_name.toLowerCase().includes(term)) ||
        (m.source && m.source.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const activeCount = members.filter((m) => m.status === "active").length;
  const unsubscribedCount = members.filter((m) => m.status === "unsubscribed").length;

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">VIP FAN CLUB MEMBERS</h1>
        <div className="admin-topbar-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleExportCsv}>
            ↓ Export CSV ({members.length})
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Metric Summary */}
        <div className="admin-metrics-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="metric-card accent-red">
            <span className="metric-label">Total Fan Base</span>
            <span className="metric-value">{members.length}</span>
            <span className="metric-meta">Direct fan acquisition database</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Active Subscribers</span>
            <span className="metric-value">{activeCount}</span>
            <span className="metric-meta">Ready for tour &amp; merch drops</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Unsubscribed</span>
            <span className="metric-value">{unsubscribedCount}</span>
            <span className="metric-meta">Opted out</span>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-actions">
              <input
                type="text"
                placeholder="Search by email..."
                className="admin-input search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="admin-select"
                style={{ width: "auto" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Members ({members.length})</option>
                <option value="active">Active ({activeCount})</option>
                <option value="unsubscribed">Unsubscribed ({unsubscribedCount})</option>
              </select>
            </div>
          </div>

          <div className="admin-table-container">
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#8c8c87" }}>
                Loading fan records...
              </div>
            ) : filteredMembers.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Acquisition Source</th>
                    <th>Consent Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <strong>{member.email}</strong>
                      </td>
                      <td>{member.first_name || "—"}</td>
                      <td>
                        <span className={`status-badge ${member.status}`}>{member.status}</span>
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "#9c9c96" }}>
                        {member.source}
                        {member.utm_source && ` (utm: ${member.utm_source})`}
                      </td>
                      <td>{new Date(member.consent_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleToggleStatus(member)}
                          >
                            {member.status === "active" ? "Unsubscribe" : "Re-activate"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteMember(member)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="admin-empty-state">
                <h3>No Members Found</h3>
                <p>Fans who join via the homepage VIP section will automatically populate this table.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
