"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Show = Database["public"]["Tables"]["shows"]["Row"];

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    venue_name: "",
    address: "",
    city: "",
    state_region: "CO",
    country: "USA",
    timezone: "America/Denver",
    event_date: "",
    doors_time: "",
    ticket_url: "",
    poster_url: "",
    supporting_text: "",
    status: "scheduled" as Database["public"]["Enums"]["show_status"],
    is_featured: false,
    is_published: true,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [formError, setFormError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("shows")
      .select("*")
      .order("event_date", { ascending: true })
      .then(({ data, error }) => {
        if (isMounted) {
          if (!error && data) setShows(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  function refetchShows() {
    supabase
      .from("shows")
      .select("*")
      .order("event_date", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setShows(data);
      });
  }

  function handleOpenCreate() {
    setEditingShow(null);
    const defaultDate = new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 16);
    setFormData({
      title: "",
      slug: "",
      venue_name: "",
      address: "",
      city: "Denver",
      state_region: "CO",
      country: "USA",
      timezone: "America/Denver",
      event_date: defaultDate,
      doors_time: "",
      ticket_url: "",
      poster_url: "",
      supporting_text: "",
      status: "scheduled",
      is_featured: false,
      is_published: true,
    });
    setFormError("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(show: Show) {
    setEditingShow(show);
    setFormData({
      title: show.title,
      slug: show.slug,
      venue_name: show.venue_name,
      address: show.address || "",
      city: show.city,
      state_region: show.state_region,
      country: show.country,
      timezone: show.timezone,
      event_date: show.event_date ? new Date(show.event_date).toISOString().slice(0, 16) : "",
      doors_time: show.doors_time ? new Date(show.doors_time).toISOString().slice(0, 16) : "",
      ticket_url: show.ticket_url || "",
      poster_url: show.poster_url || "",
      supporting_text: show.supporting_text || "",
      status: show.status,
      is_featured: show.is_featured,
      is_published: show.is_published,
    });
    setFormError("");
    setIsModalOpen(true);
  }

  async function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPoster(true);
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const fileName = `poster-${timestamp}.${fileExt}`;
    const filePath = `shows/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("show-posters")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert(`Upload error: ${uploadError.message}`);
      setUploadingPoster(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("show-posters")
      .getPublicUrl(filePath);

    setFormData((prev) => ({ ...prev, poster_url: publicUrl }));
    setUploadingPoster(false);
  }

  async function handleSaveShow(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const randomSuffix = Math.floor(Math.random() * 1000);
    const eventYear = new Date(formData.event_date).getFullYear();
    const generatedSlug =
      formData.slug ||
      `${formData.venue_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${eventYear}-${randomSuffix}`;

    const showPayload = {
      title: formData.title || `JayDubb Tha Ruler Live at ${formData.venue_name}`,
      slug: generatedSlug,
      venue_name: formData.venue_name,
      address: formData.address || null,
      city: formData.city,
      state_region: formData.state_region,
      country: formData.country,
      timezone: formData.timezone,
      event_date: new Date(formData.event_date).toISOString(),
      doors_time: formData.doors_time ? new Date(formData.doors_time).toISOString() : null,
      ticket_url: formData.ticket_url || null,
      poster_url: formData.poster_url || null,
      supporting_text: formData.supporting_text || null,
      status: formData.status,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
    };

    if (editingShow) {
      const { error } = await supabase
        .from("shows")
        .update(showPayload)
        .eq("id", editingShow.id);

      if (error) {
        setFormError(`Update failed: ${error.message}`);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("shows").insert(showPayload);
      if (error) {
        setFormError(`Creation failed: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setIsModalOpen(false);
    refetchShows();
  }

  async function handleTogglePublish(show: Show) {
    const { error } = await supabase
      .from("shows")
      .update({ is_published: !show.is_published })
      .eq("id", show.id);

    if (!error) {
      setShows((prev) =>
        prev.map((s) => (s.id === show.id ? { ...s, is_published: !s.is_published } : s))
      );
    }
  }

  async function handleDeleteShow(show: Show) {
    if (!confirm(`Are you sure you want to delete the show at "${show.venue_name}"?`)) {
      return;
    }

    const { error } = await supabase.from("shows").delete().eq("id", show.id);
    if (!error) {
      setShows((prev) => prev.filter((s) => s.id !== show.id));
    }
  }

  const filteredShows = shows.filter((s) => {
    if (filter === "published" && !s.is_published) return false;
    if (filter === "draft" && s.is_published) return false;
    if (filter === "upcoming" && new Date(s.event_date) < new Date()) return false;
    if (filter === "past" && new Date(s.event_date) >= new Date()) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        s.venue_name.toLowerCase().includes(term) ||
        s.city.toLowerCase().includes(term) ||
        s.title.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">SHOWS &amp; TOUR MANAGEMENT</h1>
        <div className="admin-topbar-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            + Add New Show
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-actions">
              <input
                type="text"
                placeholder="Search venue or city..."
                className="admin-input search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="admin-select"
                style={{ width: "auto" }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Dates ({shows.length})</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past / Archive</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
            <div>
              <span className="admin-badge">REALTIME DATABASE SYNC</span>
            </div>
          </div>

          <div className="admin-table-container">
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#8c8c87" }}>
                Loading tour dates...
              </div>
            ) : filteredShows.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date &amp; Time</th>
                    <th>Venue</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShows.map((show) => (
                    <tr key={show.id}>
                      <td>
                        <strong>{new Date(show.event_date).toLocaleDateString()}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#9c9c96" }}>
                          {new Date(show.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td>
                        <strong>{show.venue_name}</strong>
                        {show.title !== show.venue_name && (
                          <div style={{ fontSize: "0.75rem", color: "#8c8c87" }}>{show.title}</div>
                        )}
                      </td>
                      <td>
                        {show.city}, {show.state_region}
                      </td>
                      <td>
                        <span className={`status-badge ${show.status}`}>{show.status}</span>
                      </td>
                      <td>{show.is_featured ? "⭐ Yes" : "No"}</td>
                      <td>
                        <button
                          type="button"
                          className={`status-badge ${show.is_published ? "published" : "unsubscribed"}`}
                          style={{ cursor: "pointer", border: "none" }}
                          onClick={() => handleTogglePublish(show)}
                        >
                          {show.is_published ? "Live" : "Draft"}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEdit(show)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteShow(show)}
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
                <h3>No Shows Found</h3>
                <p>Add tour dates, festival slots, and club showcases to make them live on the public site.</p>
                <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
                  + Add First Show
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show Creation / Editing Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingShow ? "EDIT SHOW DETAILS" : "SCHEDULE NEW SHOW"}</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShow}>
              {formError && (
                <div style={{ padding: "0.75rem", background: "rgba(239,68,68,0.2)", color: "#f87171", marginBottom: "1rem" }}>
                  {formError}
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Venue Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. The Black Sheep / Marquis Theater"
                    value={formData.venue_name}
                    onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Show / Tour Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. The Year of the 7 Tour"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="Colorado Springs / Denver"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>State / Region *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="CO"
                    value={formData.state_region}
                    onChange={(e) => setFormData({ ...formData, state_region: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>Event Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    required
                    className="admin-input"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Doors Time (Optional)</label>
                  <input
                    type="datetime-local"
                    className="admin-input"
                    value={formData.doors_time}
                    onChange={(e) => setFormData({ ...formData, doors_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Ticket URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://ticketmaster.com/event/..."
                  value={formData.ticket_url}
                  onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
                />
              </div>

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>Status</label>
                  <select
                    className="admin-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Database["public"]["Enums"]["show_status"],
                      })
                    }
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="postponed">Postponed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Supporting Text / Notes</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="All Ages · Supporting Acts TBA"
                    value={formData.supporting_text}
                    onChange={(e) => setFormData({ ...formData, supporting_text: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Poster Artwork (Upload or URL)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="https://... or upload below"
                    value={formData.poster_url}
                    onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  />
                  <label className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
                    {uploadingPoster ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePosterUpload}
                      disabled={uploadingPoster}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.25rem" }}>
                <div className="form-checkbox-row">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  <label htmlFor="is_featured">Featured Show (Promoted banner)</label>
                </div>
                <div className="form-checkbox-row">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <label htmlFor="is_published">Published (Visible on site)</label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editingShow ? "Save Changes" : "Create Show"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
