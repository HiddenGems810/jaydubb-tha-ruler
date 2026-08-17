"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type PressItem = Database["public"]["Tables"]["press_items"]["Row"];

export default function AdminPressPage() {
  const [items, setItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PressItem | null>(null);

  const [formData, setFormData] = useState({
    outlet: "",
    title: "",
    article_url: "",
    published_date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    image_url: "",
    is_featured: false,
    is_published: true,
  });

  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("press_items")
      .select("*")
      .order("published_date", { ascending: false })
      .then(({ data }) => {
        if (isMounted) {
          if (data) setItems(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  function refetchPress() {
    supabase
      .from("press_items")
      .select("*")
      .order("published_date", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }

  function handleOpenCreate() {
    setEditingItem(null);
    setFormData({
      outlet: "",
      title: "",
      article_url: "",
      published_date: new Date().toISOString().slice(0, 10),
      excerpt: "",
      image_url: "",
      is_featured: false,
      is_published: true,
    });
    setIsModalOpen(true);
  }

  function handleOpenEdit(item: PressItem) {
    setEditingItem(item);
    setFormData({
      outlet: item.outlet,
      title: item.title,
      article_url: item.article_url,
      published_date: item.published_date,
      excerpt: item.excerpt || "",
      image_url: item.image_url || "",
      is_featured: item.is_featured,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      outlet: formData.outlet,
      title: formData.title,
      article_url: formData.article_url,
      published_date: formData.published_date,
      excerpt: formData.excerpt || null,
      image_url: formData.image_url || null,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      display_order: items.length + 1,
    };

    if (editingItem) {
      await supabase.from("press_items").update(payload).eq("id", editingItem.id);
    } else {
      await supabase.from("press_items").insert(payload);
    }

    setSaving(false);
    setIsModalOpen(false);
    refetchPress();
  }

  async function handleDelete(item: PressItem) {
    if (!confirm(`Delete press item "${item.title}"?`)) return;
    await supabase.from("press_items").delete().eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">PRESS &amp; EDITORIAL COVERAGE</h1>
        <div className="admin-topbar-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            + Add Press Feature
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">EDITORIAL ARTICLES &amp; INTERVIEWS ({items.length})</h2>
          </div>

          <div className="admin-table-container">
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#8c8c87" }}>
                Loading press items...
              </div>
            ) : items.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Outlet</th>
                    <th>Headline</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.outlet}</strong></td>
                      <td>
                        <a href={item.article_url} target="_blank" rel="noreferrer" style={{ color: "#f5f5f2", textDecoration: "underline" }}>
                          {item.title} ↗
                        </a>
                      </td>
                      <td>{item.published_date}</td>
                      <td>
                        <span className={`status-badge ${item.is_published ? "published" : "unsubscribed"}`}>
                          {item.is_published ? "Live" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(item)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>
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
                <h3>No Press Items Added</h3>
                <p>Record interviews, reviews, and blog features for the media section.</p>
                <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
                  + Add First Press Item
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
              <h2 className="modal-title">{editingItem ? "EDIT PRESS ITEM" : "ADD PRESS COVERAGE"}</h2>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Media Outlet *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. HipHopDX, 303 Magazine"
                    value={formData.outlet}
                    onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Published Date *</label>
                  <input
                    type="date"
                    required
                    className="admin-input"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Article Headline *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. JayDubb Tha Ruler drops cinematic 'Aquarium Floors'"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Article URL *</label>
                <input
                  type="url"
                  required
                  className="admin-input"
                  placeholder="https://..."
                  value={formData.article_url}
                  onChange={(e) => setFormData({ ...formData, article_url: e.target.value })}
                />
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Excerpt / Quote</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  placeholder="Memorable quote from the review or interview..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Press Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
