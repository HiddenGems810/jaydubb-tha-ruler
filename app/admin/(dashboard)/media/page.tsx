"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type MediaItem = Database["public"]["Tables"]["media_items"]["Row"];

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    file_url: "",
    alt_text: "",
    category: "live",
    credit: "",
    caption: "",
    is_featured: false,
    is_published: true,
  });

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("media_items")
      .select("*")
      .order("display_order", { ascending: true })
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

  function refetchMedia() {
    supabase
      .from("media_items")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `media-${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error } = await supabase.storage.from("artist-media").upload(filePath, file, { upsert: true });
    if (error) {
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("artist-media").getPublicUrl(filePath);
    setFormData((prev) => ({
      ...prev,
      file_url: publicUrl,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      alt_text: prev.alt_text || `JayDubb Tha Ruler ${file.name.replace(/\.[^/.]+$/, "")}`,
    }));
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.file_url) {
      alert("Please upload or provide a file URL.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("media_items").insert({
      title: formData.title || "Artist Media",
      file_url: formData.file_url,
      alt_text: formData.alt_text || "JayDubb Tha Ruler Photography",
      category: formData.category,
      credit: formData.credit || null,
      caption: formData.caption || null,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      display_order: items.length + 1,
    });

    if (error) {
      alert(`Save error: ${error.message}`);
    } else {
      setIsModalOpen(false);
      refetchMedia();
    }
    setSaving(false);
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete media item "${item.title}"?`)) return;
    const { error } = await supabase.from("media_items").delete().eq("id", item.id);
    if (!error) setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">MEDIA &amp; ASSET VAULT</h1>
        <div className="admin-topbar-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            + Upload Asset
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">ARTIST PHOTOGRAPHY &amp; VIDEO ASSETS ({items.length})</h2>
          </div>

          <div className="admin-table-container">
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#8c8c87" }}>
                Loading media vault...
              </div>
            ) : items.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))", gap: "1rem", padding: "1.5rem" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ background: "#16171c", border: "1px solid #23242a", overflow: "hidden" }}>
                    <div style={{ height: "10rem", background: "#000", position: "relative" }}>
                      <Image
                        src={item.file_url}
                        alt={item.alt_text}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "0.85rem" }}>
                      <strong style={{ fontSize: "0.85rem", display: "block", color: "#f5f5f2", marginBottom: "0.25rem" }}>
                        {item.title}
                      </strong>
                      <div style={{ fontSize: "0.7rem", color: "#8c8c87", marginBottom: "0.5rem" }}>
                        Category: {item.category} {item.credit && `· Credit: ${item.credit}`}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigator.clipboard.writeText(item.file_url)}
                        >
                          Copy URL
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state">
                <h3>No Media Items Uploaded</h3>
                <p>Upload photography, performance stills, and artwork directly to Supabase Storage.</p>
                <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  + Upload First Asset
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
              <h2 className="modal-title">UPLOAD MEDIA ASSET</h2>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-field">
                <label>Select Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="admin-input"
                />
                {uploading && <p style={{ fontSize: "0.75rem", color: "#facc15", marginTop: "0.25rem" }}>Uploading to Supabase Storage...</p>}
              </div>

              {formData.file_url && (
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ width: "100%", height: "12rem", position: "relative", marginBottom: "0.5rem" }}>
                    <Image
                      src={formData.file_url}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "contain", background: "#000" }}
                    />
                  </div>
                  <input type="text" readOnly className="admin-input" value={formData.file_url} />
                </div>
              )}

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Stage Mic Live Showcase"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select
                    className="admin-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="live">Live Performance</option>
                    <option value="press">Press Shoot</option>
                    <option value="studio">Studio Session</option>
                    <option value="behind_the_scenes">Behind the Scenes</option>
                  </select>
                </div>
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Alt Text (SEO &amp; Accessibility) *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="Descriptive alt text for screen readers and SEO"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                />
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Photo Credit</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Photography by TAG Designs"
                  value={formData.credit}
                  onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                  {saving ? "Saving..." : "Save to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
