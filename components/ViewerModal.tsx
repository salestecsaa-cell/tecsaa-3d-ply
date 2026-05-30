"use client";

import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  property: Property;
  onClose: () => void;
}

export default function ViewerModal({ property, onClose }: Props) {
  // Build viewer URL — uses your tecsaa-3d-vi deployed instance
  const viewerBase = process.env.NEXT_PUBLIC_VIEWER_URL || "https://tecsaa-3d-vi.vercel.app";
  const viewerUrl = property.ply_url
    ? `${viewerBase}?url=${encodeURIComponent(property.ply_url)}`
    : viewerBase;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.9)",
        display: "flex", flexDirection: "column",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 56, flexShrink: 0,
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center",
          padding: "0 1.5rem", gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <span className="syne" style={{ fontWeight: 700, fontSize: 15 }}>{property.title}</span>
          {property.location && (
            <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>📍 {property.location}</span>
          )}
        </div>
        <span style={{ fontWeight: 600, color: "var(--orange)", fontSize: 14 }}>{formatPrice(property.price)}</span>
        <a
          href={viewerUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 500,
            background: "var(--card2)", color: "var(--text)",
            border: "1px solid var(--border)", textDecoration: "none",
          }}
        >
          Open full page ↗
        </a>
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: 8, fontSize: 18,
            background: "var(--card2)", color: "var(--muted)",
            border: "1px solid var(--border)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Viewer iframe */}
      <div style={{ flex: 1, position: "relative" }}>
        {property.ply_url ? (
          <iframe
            src={viewerUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; camera; gyroscope"
            title={`3D viewer — ${property.title}`}
          />
        ) : (
          <div
            style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "var(--muted)", gap: 12,
            }}
          >
            <div style={{ fontSize: 56 }}>🏠</div>
            <div style={{ fontSize: 16 }}>No 3D file attached yet</div>
            <div style={{ fontSize: 13, color: "var(--muted2)" }}>Upload a .ply or .splat file to view in 3D</div>
          </div>
        )}
      </div>
    </div>
  );
}
