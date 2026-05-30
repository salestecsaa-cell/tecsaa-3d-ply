"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

const TOOLS = [
  { id: "select", icon: "↖", label: "Select" },
  { id: "pan", icon: "✋", label: "Pan" },
  { id: "zoom", icon: "🔍", label: "Zoom" },
  { id: "box", icon: "⬜", label: "Box Crop" },
  { id: "poly", icon: "⬡", label: "Poly Crop" },
];

const PANEL_TABS = ["Scene", "Splats", "Camera", "Export"];

export default function EditorPage() {
  const [activeTool, setActiveTool] = useState("select");
  const [activeTab, setActiveTab] = useState("Scene");
  const [splatUrl, setSplatUrl] = useState("");
  const [loadedUrl, setLoadedUrl] = useState("");

  const viewerBase = process.env.NEXT_PUBLIC_VIEWER_URL || "https://tecsaa-3d-vi.vercel.app";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Editor layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Left tool palette */}
        <div style={{
          width: 52, flexShrink: 0,
          background: "var(--card)", borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "12px 0", gap: 4,
        }}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              title={t.label}
              onClick={() => setActiveTool(t.id)}
              style={{
                width: 38, height: 38, borderRadius: 8,
                background: activeTool === t.id ? "rgba(249,115,22,0.15)" : "none",
                color: activeTool === t.id ? "var(--orange)" : "var(--muted)",
                border: `1px solid ${activeTool === t.id ? "rgba(249,115,22,0.3)" : "transparent"}`,
                cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {t.icon}
            </button>
          ))}
        </div>

        {/* Main 3D viewport */}
        <div style={{ flex: 1, position: "relative", background: "#0d0d0f", display: "flex", flexDirection: "column" }}>
          {/* URL bar */}
          <div style={{
            padding: "8px 12px",
            background: "var(--card)", borderBottom: "1px solid var(--border)",
            display: "flex", gap: 8, alignItems: "center",
          }}>
            <input
              type="text"
              placeholder="Paste .ply / .splat URL to load in editor…"
              value={splatUrl}
              onChange={(e) => setSplatUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setLoadedUrl(splatUrl); }}
              style={{
                flex: 1, padding: "6px 12px", fontSize: 13,
                background: "var(--card2)", border: "1px solid var(--border)",
                borderRadius: 7, color: "var(--text)", outline: "none",
              }}
            />
            <button
              onClick={() => setLoadedUrl(splatUrl)}
              style={{
                padding: "6px 14px", borderRadius: 7, fontSize: 13,
                background: "var(--orange)", color: "white", border: "none", cursor: "pointer",
              }}
            >
              Load
            </button>
          </div>

          {/* Viewport */}
          <div style={{ flex: 1, position: "relative" }}>
            {loadedUrl ? (
              <iframe
                src={`${viewerBase}?url=${encodeURIComponent(loadedUrl)}`}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="TECSAA 3D Editor"
              />
            ) : (
              <div style={{
                height: "100%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                color: "var(--muted)", gap: 16,
              }}>
                <div style={{ fontSize: 64, opacity: 0.25 }}>◈</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>No splat loaded</div>
                <div style={{ fontSize: 13, color: "var(--muted2)", textAlign: "center", maxWidth: 320 }}>
                  Paste a .ply or .splat file URL above and click Load, or open a property from your Dashboard
                </div>
                <a
                  href={viewerBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 20px", borderRadius: 8, fontSize: 13,
                    background: "var(--card2)", color: "var(--text)",
                    border: "1px solid var(--border)", textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  Open TECSAA Viewer ↗
                </a>
              </div>
            )}

            {/* Axis gizmo */}
            <div style={{
              position: "absolute", bottom: 16, left: 16,
              width: 64, height: 64,
              background: "rgba(17,17,19,0.8)", borderRadius: 8,
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: "var(--muted2)", flexDirection: "column",
            }}>
              <div style={{ position: "relative", width: 40, height: 40 }}>
                {[
                  { label: "X", color: "#F87171", dx: 18, dy: 0 },
                  { label: "Y", color: "#4ADE80", dx: -4, dy: -18 },
                  { label: "Z", color: "#60A5FA", dx: -18, dy: 10 },
                ].map((ax) => (
                  <div key={ax.label} style={{
                    position: "absolute", left: `calc(50% + ${ax.dx}px)`, top: `calc(50% + ${ax.dy}px)`,
                    width: 6, height: 6, borderRadius: "50%", background: ax.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ position: "absolute", left: 8, fontSize: 9, color: ax.color, fontWeight: 600 }}>{ax.label}</span>
                  </div>
                ))}
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--muted2)" }} />
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            height: 26, background: "var(--card)", borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center", padding: "0 12px", gap: 20,
            fontSize: 11, color: "var(--muted2)",
          }}>
            <span>Tool: <span style={{ color: "var(--text)" }}>{TOOLS.find(t => t.id === activeTool)?.label}</span></span>
            {loadedUrl && <span>Loaded: <span style={{ color: "var(--orange)" }}>{loadedUrl.split("/").pop()}</span></span>}
            <span style={{ marginLeft: "auto" }}>TECSAA Editor v1.0</span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          width: 260, flexShrink: 0,
          background: "var(--card)", borderLeft: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            {PANEL_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "10px 4px", fontSize: 12, fontWeight: 500,
                  background: activeTab === tab ? "var(--card2)" : "none",
                  color: activeTab === tab ? "var(--text)" : "var(--muted2)",
                  border: "none", borderBottom: activeTab === tab ? `2px solid var(--orange)` : "2px solid transparent",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
            {activeTab === "Scene" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Background</div>
                {[
                  { label: "Dark", color: "#0d0d0f" },
                  { label: "Gray", color: "#1a1a1a" },
                  { label: "Light", color: "#e5e5e5" },
                ].map((bg) => (
                  <label key={bg.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: bg.color, border: "1px solid var(--border)" }} />
                    <span style={{ fontSize: 13 }}>{bg.label}</span>
                  </label>
                ))}
                <div style={{ marginTop: 8, fontSize: 12, fontWeight: 500, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Splat Count</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--orange)" }}>—</div>
              </div>
            )}
            {activeTab === "Camera" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["FOV", "Near", "Far"].map((param) => (
                  <div key={param}>
                    <label style={{ fontSize: 12, color: "var(--muted2)", display: "block", marginBottom: 4 }}>{param}</label>
                    <input
                      type="range" min={0} max={100}
                      style={{ width: "100%", accentColor: "var(--orange)" }}
                    />
                  </div>
                ))}
              </div>
            )}
            {activeTab === "Export" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Export .ply", "Export .splat", "Export screenshot", "Share link"].map((action) => (
                  <button
                    key={action}
                    style={{
                      padding: "9px 14px", borderRadius: 8, fontSize: 13,
                      background: "var(--card2)", color: "var(--text)",
                      border: "1px solid var(--border)", cursor: "pointer", textAlign: "left",
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
            {activeTab === "Splats" && (
              <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--muted2)", fontSize: 13 }}>
                Load a .ply file to see splat details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
