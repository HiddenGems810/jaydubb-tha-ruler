"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database, Json } from "@/types/database";

type Setting = Database["public"]["Tables"]["site_settings"]["Row"];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    supabase
      .from("site_settings")
      .select("*")
      .then(({ data }) => {
        if (isMounted) {
          if (data) setSettings(data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function handleSaveSetting(setting: Setting, jsonString: string) {
    try {
      setSavingKey(setting.key);
      const parsed = JSON.parse(jsonString) as Json;
      const { error } = await supabase
        .from("site_settings")
        .update({ value: parsed })
        .eq("key", setting.key);

      if (error) {
        alert(`Save error: ${error.message}`);
      } else {
        alert(`Saved setting: ${setting.key}`);
      }
    } catch {
      alert("Invalid JSON format. Please check syntax.");
    }
    setSavingKey(null);
  }

  return (
    <div>
      <header className="admin-topbar">
        <h1 className="admin-page-title">ARTIST SITE SETTINGS</h1>
        <div className="admin-topbar-actions">
          <span className="admin-badge">GLOBAL CONFIGURATION</span>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">DYNAMIC CONFIGURATION OBJECTS</h2>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {loading ? (
              <p style={{ color: "#8c8c87" }}>Loading settings...</p>
            ) : settings.length > 0 ? (
              settings.map((setting) => (
                <div key={setting.key} style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #1f2024" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div>
                      <strong style={{ fontFamily: "var(--font-mono)", color: "#f5f5f2" }}>{setting.key}</strong>
                      <span style={{ fontSize: "0.75rem", color: "#8c8c87", marginLeft: "0.75rem" }}>
                        {setting.description}
                      </span>
                    </div>
                    <span className={`status-badge ${setting.is_public ? "published" : "unsubscribed"}`}>
                      {setting.is_public ? "Public API" : "Private"}
                    </span>
                  </div>

                  <textarea
                    id={`setting-${setting.key}`}
                    className="admin-textarea"
                    rows={6}
                    defaultValue={JSON.stringify(setting.value, null, 2)}
                    style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={savingKey === setting.key}
                      onClick={() => {
                        const el = document.getElementById(`setting-${setting.key}`) as HTMLTextAreaElement;
                        if (el) handleSaveSetting(setting, el.value);
                      }}
                    >
                      {savingKey === setting.key ? "Saving..." : "Update Config"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No site settings found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
