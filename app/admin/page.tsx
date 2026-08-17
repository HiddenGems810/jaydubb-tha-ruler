import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // Fetch metrics in parallel
  const [
    { count: vipCount },
    { data: recentVipMembers },
    { data: shows },
    { data: releases },
    { data: inquiries, count: newInquiriesCount },
  ] = await Promise.all([
    supabase.from("vip_members").select("*", { count: "exact", head: true }),
    supabase.from("vip_members").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("shows").select("*").order("event_date", { ascending: true }),
    supabase.from("releases").select("*").order("display_order", { ascending: true }),
    supabase.from("booking_inquiries").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
  ]);

  const now = new Date();
  const upcomingShows = (shows || []).filter((s) => new Date(s.event_date) >= now && s.is_published);
  const nearestShow = upcomingShows[0] || null;
  const featuredRelease = (releases || []).find((r) => r.is_featured) || (releases || [])[0] || null;

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">ARTIST OPERATING DASHBOARD</h1>
        <div className="admin-topbar-actions">
          <Link href="/admin/shows" className="btn btn-primary btn-sm">
            + Add Show
          </Link>
          <Link href="/admin/vip" className="btn btn-secondary btn-sm">
            VIP Fan List
          </Link>
        </div>
      </header>

      <div className="admin-content">
        {/* Metric Cards Grid */}
        <div className="admin-metrics-grid">
          <div className="metric-card accent-red">
            <span className="metric-label">Total VIP Fan Club Members</span>
            <span className="metric-value">{vipCount || 0}</span>
            <span className="metric-meta">Subscribed to The 7 acquisition loop</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Upcoming Tour Dates</span>
            <span className="metric-value">{upcomingShows.length}</span>
            <span className="metric-meta">
              {nearestShow
                ? `Next: ${nearestShow.city} (${new Date(nearestShow.event_date).toLocaleDateString()})`
                : "No future dates active"}
            </span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Active Releases</span>
            <span className="metric-value">{(releases || []).length}</span>
            <span className="metric-meta">Lead: {featuredRelease ? featuredRelease.title : "None"}</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Pending Inquiries</span>
            <span className="metric-value">{newInquiriesCount || 0}</span>
            <span className="metric-meta">Booking &amp; press requests</span>
          </div>
        </div>

        {/* 2-Column Split: Shows & VIP Signups */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))", gap: "1.5rem" }}>
          {/* Upcoming Shows Preview */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">UPCOMING SHOWS</h2>
              <Link href="/admin/shows" className="btn btn-secondary btn-sm">
                Manage Shows →
              </Link>
            </div>
            <div className="admin-table-container">
              {upcomingShows.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Venue</th>
                      <th>City</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingShows.slice(0, 5).map((show) => (
                      <tr key={show.id}>
                        <td>{new Date(show.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                        <td><strong>{show.venue_name}</strong></td>
                        <td>{show.city}, {show.state_region}</td>
                        <td>
                          <span className={`status-badge ${show.status}`}>{show.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", color: "#8c8c87" }}>
                  <p style={{ margin: "0 0 1rem" }}>No upcoming shows currently scheduled.</p>
                  <Link href="/admin/shows" className="btn btn-primary btn-sm">
                    + Schedule New Date
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent VIP Members */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">RECENT VIP FAN SIGNUPS</h2>
              <Link href="/admin/vip" className="btn btn-secondary btn-sm">
                View All &amp; Export →
              </Link>
            </div>
            <div className="admin-table-container">
              {(recentVipMembers || []).length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Acquired</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recentVipMembers || []).map((member) => (
                      <tr key={member.id}>
                        <td>{member.email}</td>
                        <td>
                          <span className={`status-badge ${member.status}`}>{member.status}</span>
                        </td>
                        <td>{new Date(member.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", color: "#8c8c87" }}>
                  <p>No VIP signups recorded yet. Connect with fans on the live site.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Inquiries Card */}
        <div className="admin-card" style={{ marginTop: "1.5rem" }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">LATEST BOOKING &amp; PRESS INQUIRIES</h2>
            <Link href="/admin/inquiries" className="btn btn-secondary btn-sm">
              View Inbox →
            </Link>
          </div>
          <div className="admin-table-container">
            {(inquiries || []).length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date Received</th>
                  </tr>
                </thead>
                <tbody>
                  {(inquiries || []).map((inq) => (
                    <tr key={inq.id}>
                      <td><strong>{inq.name}</strong> {inq.organization ? `(${inq.organization})` : ""}</td>
                      <td>{inq.email}</td>
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
              <div style={{ padding: "2rem", textAlign: "center", color: "#8c8c87" }}>
                <p>No booking inquiries in the queue.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
