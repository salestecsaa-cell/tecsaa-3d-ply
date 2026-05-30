"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import ViewerModal from "@/components/ViewerModal";
import type { Property } from "@/types";

const SORT_OPTIONS = ["Latest", "Likes", "Views"];
const TAG_OPTIONS = ["all", "interior", "exterior", "commercial", "heritage", "object", "space"];

// Demo data shown when Supabase is not yet connected
const DEMO: Property[] = [
  { id: "d1", user_id: "demo", title: "Modern Villa — Indore", description: "Spacious 4BHK", price: 12500000, location: "Vijay Nagar, Indore", ply_url: null, thumbnail_url: null, tags: ["interior"], likes: 84, views: 3210, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "d2", user_id: "demo", title: "Commercial Space — MG Road", description: "", price: 8000000, location: "MG Road, Indore", ply_url: null, thumbnail_url: null, tags: ["commercial"], likes: 52, views: 1840, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "d3", user_id: "demo", title: "Heritage Haveli", description: "", price: null, location: "Old Indore", ply_url: null, thumbnail_url: null, tags: ["heritage"], likes: 130, views: 6700, created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "d4", user_id: "demo", title: "Penthouse Suite", description: "", price: 22000000, location: "Scheme 78, Indore", ply_url: null, thumbnail_url: null, tags: ["interior"], likes: 76, views: 2100, created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: "d5", user_id: "demo", title: "Garden Villa — AB Road", description: "", price: 9500000, location: "AB Road, Indore", ply_url: null, thumbnail_url: null, tags: ["exterior"], likes: 44, views: 1500, created_at: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: "d6", user_id: "demo", title: "Studio Apartment", description: "", price: 3200000, location: "Palasia, Indore", ply_url: null, thumbnail_url: null, tags: ["interior"], likes: 28, views: 880, created_at: new Date(Date.now() - 30 * 86400000).toISOString() },
];

export default function ExploreClient({ initialProperties }: { initialProperties: Property[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Latest");
  const [tag, setTag] = useState("all");
  const [viewItem, setViewItem] = useState<Property | null>(null);

  const properties = initialProperties.length > 0 ? initialProperties : DEMO;

  const filtered = useMemo(() => {
    let list = properties;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.location || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    if (tag !== "all") {
      list = list.filter(p => p.tags?.includes(tag));
    }
    if (sort === "Likes") list = [...list].sort((a, b) => b.likes - a.likes);
    else if (sort === "Views") list = [...list].sort((a, b) => b.views - a.views);
    return list;
  }, [properties, search, sort, tag]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero stats bar */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "10px 2rem" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 32 }}>
          {[
            { label: "Properties", value: properties.length > 0 ? `${properties.length}+` : "—" },
            { label: "3D Splats", value: properties.filter(p => p.ply_url).length > 0 ? `${properties.filter(p => p.ply_url).length}` : "—" },
            { label: "Cities", value: "12+" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="syne" style={{ fontSize: 16, fontWeight: 700, color: "var(--orange)" }}>{s.value}</span>
              <span style={{ fontSize: 13, color: "var(--muted2)" }}>{s.label}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "var(--muted2)" }}>
            {initialProperties.length === 0 && "⚠ Demo data — connect Supabase to see real listings"}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "1.5rem 2rem" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--muted2)" }}>🔍</span>
            <input
              type="text"
              placeholder="Search properties, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                fontSize: 14, background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 9, color: "var(--text)", outline: "none",
              }}
            />
          </div>

          {/* Sort */}
          <div style={{ display: "flex", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 9, overflow: "hidden" }}>
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                style={{
                  padding: "9px 14px", fontSize: 13, fontWeight: 500,
                  background: sort === s ? "var(--card2)" : "none",
                  color: sort === s ? "var(--text)" : "var(--muted)",
                  border: "none", cursor: "pointer",
                  borderRight: "1px solid var(--border)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {TAG_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 13,
                background: tag === t ? "rgba(249,115,22,0.15)" : "var(--card)",
                color: tag === t ? "var(--orange)" : "var(--muted)",
                border: `1px solid ${tag === t ? "rgba(249,115,22,0.3)" : "var(--border)"}`,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No results found</div>
            <div style={{ fontSize: 14, color: "var(--muted2)" }}>Try a different search or filter</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} onView={setViewItem} />
            ))}
          </div>
        )}
      </div>

      {viewItem && <ViewerModal property={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
}
