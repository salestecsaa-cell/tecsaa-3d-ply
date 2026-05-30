"use client";

import { useState } from "react";
import type { Property } from "@/types";
import { formatPrice, formatNumber, timeAgo } from "@/lib/utils";

interface Props {
  property: Property;
  onView?: (p: Property) => void;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({ property, onView, showActions, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const thumb = property.thumbnail_url;
  const gradients = [
    "linear-gradient(135deg,#1a1a2e,#16213e)",
    "linear-gradient(135deg,#0d0d1a,#1a0d2e)",
    "linear-gradient(135deg,#0a1628,#162a3d)",
    "linear-gradient(135deg,#1a0a0a,#2e1010)",
  ];
  const bg = gradients[Math.abs(property.id.charCodeAt(0)) % gradients.length];

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border2)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
      onClick={() => onView?.(property)}
    >
      {/* Thumbnail */}
      <div
        style={{
          aspectRatio: "4/3",
          background: thumb ? undefined : bg,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ fontSize: 48, opacity: 0.3 }}>🏠</div>
        )}
        {/* Overlay */}
        <div
          className="card-overlay"
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: 0, transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}
        >
          <div
            style={{
              padding: "8px 20px", borderRadius: 8,
              background: "var(--orange)", color: "white",
              fontSize: 13, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ▶ Open in 3D
          </div>
        </div>
        {/* Tags */}
        {property.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            style={{
              position: "absolute", top: 10, left: 10,
              background: "rgba(249,115,22,0.15)", color: "var(--orange)",
              padding: "3px 8px", borderRadius: 20, fontSize: 11,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Info */}
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {property.title}
            </div>
            {property.location && (
              <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>📍 {property.location}</div>
            )}
          </div>
          {showActions && (
            <div style={{ position: "relative", flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}>
              <button style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "2px 6px", fontSize: 18 }}>⋮</button>
              {menuOpen && (
                <div
                  style={{
                    position: "absolute", right: 0, top: "100%",
                    background: "var(--card2)", border: "1px solid var(--border)",
                    borderRadius: 8, padding: "4px 0", minWidth: 140, zIndex: 10,
                  }}
                >
                  {[
                    { label: "View 3D", action: () => { onView?.(property); setMenuOpen(false); } },
                    { label: "Edit", action: () => setMenuOpen(false) },
                    { label: "Delete", action: () => { onDelete?.(property.id); setMenuOpen(false); }, danger: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={(e) => { e.stopPropagation(); item.action(); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "8px 14px", fontSize: 13, background: "none", border: "none",
                        color: item.danger ? "#F87171" : "var(--text)", cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--orange)" }}>
            {formatPrice(property.price)}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--muted2)" }}>
            <span>♥ {formatNumber(property.likes)}</span>
            <span>👁 {formatNumber(property.views)}</span>
            <span>{timeAgo(property.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
