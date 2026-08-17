"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const [formData, setFormData] = useState({
    platform: "",
    display_name: "",
    url: "",
    is_active: true,
    display_order: 0,
  });

  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (isMounted) {
          if (data) setLinks(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  function refetchLinks() {
    supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) setLinks(data);
      });
  }

  function handleOpenCreate() {
    setEditingLink(null);
    setFormData({
      platform: "",
      display_name: "",
      url: "",
      is_active: true,
      display_order: links.length + 1,
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(link: SocialLink) {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      display_name: link.display_name,
      url: link.url,
      is_active: link.is_active,
      display_order: link.display_order,
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      platform: formData.platform.toLowerCase().trim(),
      display_name: formData.display_name.trim(),
      url: formData.url.trim(),
      is_active: formData.is_active,
      display_order: Number(formData.display_order) || 0,
    };

    if (editingLink) {
      await supabase.from("social_links").update(payload).eq("id", editingLink.id);
    } else {
      await supabase.from("social_links").insert(payload);
    }

    setSaving(false);
    setIsModalOpen(false);
    refetchLinks();
  }

  async function handleDelete(link: SocialLink) {
    if (!confirm(`Delete link for "${link.display_name}"?`)) return;
    await supabase.from("social_links").delete().eq("id", link.id);
    setLinks((prev) => prev.filter((l) => l.id !== link.id));
  }

  async function handleToggleActive(link: SocialLink) {
    const { error } = await supabase
      .from("social_links")
      .update({ is_active: !link.is_active })
      .eq("id", link.id);

    if (!error) {
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, is_active: !link.is_active } : l))
      );
    }
  }

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">SOCIAL CHANNELS &amp; DESTINATIONS</h1>
        <div className="admin-topbar-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            + Add Social Channel
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">MANAGED PLATFORM DESTINATIONS ({links.length})</h2>
          </div>

          <div className="admin-table-container">
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#8c8c87" }}>
                Loading social destinations...
              </div>
            ) : links.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Display Name</th>
                    <th>Destination URL</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td style={{ textTransform: "capitalize" }}><strong>{link.platform}</strong></td>
                      <td>{link.display_name}</td>
                      <td>
                        <a href={link.url} target="_blank" rel="noreferrer" style={{ color: "#c1121f" }}>
                          {link.url} ↗
                        </a>
                      </td>
                      <td>{link.display_order}</td>
                      <td>
                        <button
                          type="button"
                          className={`status-badge ${link.is_active ? "active" : "unsubscribed"}`}
                          style={{ cursor: "pointer", border: "none" }}
                          onClick={() => handleToggleActive(link)}
                        >
                          {link.is_active ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(link)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(link)}>
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
                <h3>No Social Channels Configured</h3>
                <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
                  + Add First Platform
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingLink ? "EDIT SOCIAL CHANNEL" : "ADD SOCIAL DESTINATION"}</h2>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Platform Key (e.g. spotify, instagram) *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="spotify"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Display Label *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="Spotify"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Destination URL *</label>
                <input
                  type="url"
                  required
                  className="admin-input"
                  placeholder="https://open.spotify.com/artist/..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>Display Priority Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  />
                </div>
                <div className="form-checkbox-row" style={{ marginTop: "1.5rem" }}>
                  <input
                    type="checkbox"
                    id="is_active_social"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active_social">Active &amp; Visible</label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
