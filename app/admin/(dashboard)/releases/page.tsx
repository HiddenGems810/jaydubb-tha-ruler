"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Release = Database["public"]["Tables"]["releases"]["Row"];

export default function AdminReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    release_type: "single" as Database["public"]["Enums"]["release_type"],
    release_date: new Date().toISOString().slice(0, 10),
    artwork_url: "",
    description: "",
    spotify_url: "",
    apple_music_url: "",
    youtube_url: "",
    audiomack_url: "",
    amazon_music_url: "",
    is_featured: false,
    is_published: true,
    display_order: 0,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [formError, setFormError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("releases")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (isMounted) {
          if (!error && data) setReleases(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  function refetchReleases() {
    supabase
      .from("releases")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setReleases(data);
      });
  }

  function handleOpenCreate() {
    setEditingRelease(null);
    setFormData({
      title: "",
      slug: "",
      release_type: "single",
      release_date: new Date().toISOString().slice(0, 10),
      artwork_url: "",
      description: "",
      spotify_url: "",
      apple_music_url: "",
      youtube_url: "",
      audiomack_url: "",
      amazon_music_url: "",
      is_featured: false,
      is_published: true,
      display_order: releases.length + 1,
    });
    setFormError("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(release: Release) {
    setEditingRelease(release);
    setFormData({
      title: release.title,
      slug: release.slug,
      release_type: release.release_type,
      release_date: release.release_date,
      artwork_url: release.artwork_url,
      description: release.description || "",
      spotify_url: release.spotify_url || "",
      apple_music_url: release.apple_music_url || "",
      youtube_url: release.youtube_url || "",
      audiomack_url: release.audiomack_url || "",
      amazon_music_url: release.amazon_music_url || "",
      is_featured: release.is_featured,
      is_published: release.is_published,
      display_order: release.display_order,
    });
    setFormError("");
    setIsModalOpen(true);
  }

  async function handleArtworkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingArtwork(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `artwork-${Date.now()}.${fileExt}`;
    const filePath = `releases/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("release-artwork")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert(`Upload error: ${uploadError.message}`);
      setUploadingArtwork(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("release-artwork")
      .getPublicUrl(filePath);

    setFormData((prev) => ({ ...prev, artwork_url: publicUrl }));
    setUploadingArtwork(false);
  }

  async function handleSaveRelease(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const generatedSlug =
      formData.slug ||
      formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const payload = {
      title: formData.title,
      slug: generatedSlug,
      release_type: formData.release_type,
      release_date: formData.release_date,
      artwork_url: formData.artwork_url || "/images/jay-dubb/profile-moody.jpg",
      description: formData.description || null,
      spotify_url: formData.spotify_url || null,
      apple_music_url: formData.apple_music_url || null,
      youtube_url: formData.youtube_url || null,
      audiomack_url: formData.audiomack_url || null,
      amazon_music_url: formData.amazon_music_url || null,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      display_order: Number(formData.display_order) || 0,
    };

    if (editingRelease) {
      const { error } = await supabase
        .from("releases")
        .update(payload)
        .eq("id", editingRelease.id);

      if (error) {
        setFormError(`Update failed: ${error.message}`);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("releases").insert(payload);
      if (error) {
        setFormError(`Creation failed: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setIsModalOpen(false);
    refetchReleases();
  }

  async function handleDeleteRelease(release: Release) {
    if (!confirm(`Are you sure you want to delete "${release.title}"?`)) {
      return;
    }

    const { error } = await supabase.from("releases").delete().eq("id", release.id);
    if (!error) {
      setReleases((prev) => prev.filter((r) => r.id !== release.id));
    }
  }

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">MUSIC &amp; RELEASES CMS</h1>
        <div className="admin-topbar-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
            + Add New Release
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">DISCOGRAPHY RELEASES ({releases.length})</h2>
          </div>

          <div className="admin-table-container">
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#8c8c87" }}>
                Loading discography...
              </div>
            ) : releases.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Artwork</th>
                    <th>Title &amp; Type</th>
                    <th>Release Date</th>
                    <th>Order</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map((release) => (
                    <tr key={release.id}>
                      <td style={{ width: "4rem" }}>
                        <Image
                          src={release.artwork_url}
                          alt={release.title}
                          width={48}
                          height={48}
                          style={{ objectFit: "cover", borderRadius: "2px" }}
                        />
                      </td>
                      <td>
                        <strong>{release.title}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#9c9c96", textTransform: "uppercase" }}>
                          {release.release_type} · /{release.slug}
                        </div>
                      </td>
                      <td>{release.release_date}</td>
                      <td>{release.display_order}</td>
                      <td>{release.is_featured ? "⭐ Lead" : "—"}</td>
                      <td>
                        <span className={`status-badge ${release.is_published ? "published" : "unsubscribed"}`}>
                          {release.is_published ? "Live" : "Draft"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEdit(release)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteRelease(release)}
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
                <h3>No Releases Found</h3>
                <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
                  + Add First Release
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingRelease ? "EDIT RELEASE" : "ADD NEW RELEASE"}</h2>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRelease}>
              {formError && (
                <div style={{ padding: "0.75rem", background: "rgba(239,68,68,0.2)", color: "#f87171", marginBottom: "1rem" }}>
                  {formError}
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Title *</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    placeholder="e.g. Aquarium Floors"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>URL Slug</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. aquarium-floors"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>Release Type</label>
                  <select
                    className="admin-select"
                    value={formData.release_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        release_type: e.target.value as Database["public"]["Enums"]["release_type"],
                      })
                    }
                  >
                    <option value="single">Single</option>
                    <option value="ep">EP</option>
                    <option value="album">Album</option>
                    <option value="mixtape">Mixtape</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Release Date *</label>
                  <input
                    type="date"
                    required
                    className="admin-input"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Artwork Artwork (Upload or URL)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="https://... or upload"
                    value={formData.artwork_url}
                    onChange={(e) => setFormData({ ...formData, artwork_url: e.target.value })}
                  />
                  <label className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
                    {uploadingArtwork ? "Uploading..." : "Upload Artwork"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleArtworkUpload}
                      disabled={uploadingArtwork}
                    />
                  </label>
                </div>
              </div>

              <div className="form-field" style={{ marginTop: "1rem" }}>
                <label>Description / Editorial Copy</label>
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>Spotify URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://open.spotify.com/..."
                    value={formData.spotify_url}
                    onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Apple Music URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://music.apple.com/..."
                    value={formData.apple_music_url}
                    onChange={(e) => setFormData({ ...formData, apple_music_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>YouTube Music / Video URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="https://youtube.com/..."
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Display Order (Priority)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.25rem" }}>
                <div className="form-checkbox-row">
                  <input
                    type="checkbox"
                    id="is_featured_release"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  <label htmlFor="is_featured_release">Featured Lead Release</label>
                </div>
                <div className="form-checkbox-row">
                  <input
                    type="checkbox"
                    id="is_published_release"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  />
                  <label htmlFor="is_published_release">Published</label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editingRelease ? "Save Changes" : "Create Release"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
