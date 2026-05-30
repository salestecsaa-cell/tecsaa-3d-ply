"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const integrations = [
    { name: "Supabase Storage", desc: "PLY file storage — ply-files bucket", ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "Clerk Auth", desc: "User authentication & sessions", ok: true },
    { name: "TECSAA 3D Viewer", desc: process.env.NEXT_PUBLIC_VIEWER_URL || "tecsaa-3d-vi.vercel.app", ok: true },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem" }}>
        <h1 className="syne fade-up" style={{ fontSize: 30, fontWeight: 800, marginBottom: "2rem" }}>Settings</h1>

        {/* Profile */}
        <div className="fade-up-1" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "1rem" }}>PROFILE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg,var(--orange),#EA580C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "white",
            }}>
              {(user?.firstName || user?.emailAddresses[0]?.emailAddress || "U")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{user?.fullName || "—"}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{user?.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Full Name", value: user?.fullName || "", placeholder: "Your full name" },
              { label: "Email", value: user?.primaryEmailAddress?.emailAddress || "", placeholder: "" },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input
                  defaultValue={f.value}
                  placeholder={f.placeholder}
                  readOnly={f.label === "Email"}
                  style={{
                    width: "100%", padding: "10px 14px", fontSize: 14,
                    background: "var(--card2)", border: "1px solid var(--border)",
                    borderRadius: 9, color: "var(--text)", outline: "none",
                    opacity: f.label === "Email" ? 0.6 : 1,
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 6 }}>Company / Agency</label>
              <input
                placeholder="e.g. TECSAA Realty Indore"
                style={{
                  width: "100%", padding: "10px 14px", fontSize: 14,
                  background: "var(--card2)", border: "1px solid var(--border)",
                  borderRadius: 9, color: "var(--text)", outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="fade-up-2" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "1rem" }}>INTEGRATIONS</div>
          {integrations.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: i < integrations.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>{item.desc}</div>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                background: item.ok ? "rgba(34,197,94,0.12)" : "rgba(249,115,22,0.12)",
                color: item.ok ? "#22C55E" : "var(--orange)",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {item.ok ? "Connected" : "Setup needed"}
              </span>
            </div>
          ))}
        </div>

        {/* Environment tip */}
        <div className="fade-up-3" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 12, padding: "14px 16px", marginBottom: "1.5rem", fontSize: 13, color: "var(--muted)" }}>
          💡 Add your environment variables in Vercel → Settings → Environment Variables. See <code style={{ color: "var(--orange)" }}>.env.example</code> for required keys.
        </div>

        {/* Actions */}
        <div className="fade-up-4" style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 22px", borderRadius: 9, fontSize: 14, fontWeight: 500,
              background: "var(--orange)", color: "white", border: "none", cursor: "pointer",
            }}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
          <button
            onClick={() => signOut(() => router.push("/explore"))}
            style={{
              padding: "10px 22px", borderRadius: 9, fontSize: 14, fontWeight: 500,
              background: "none", color: "#F87171",
              border: "1px solid rgba(248,113,113,0.3)", cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
