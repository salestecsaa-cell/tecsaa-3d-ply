"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import ViewerModal from "@/components/ViewerModal";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function DashboardClient({ initialProperties }: { initialProperties: Property[] }) {
  const { user } = useUser();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [viewItem, setViewItem] = useState<Property | null>(null);

  const totalValue = properties.reduce((s, p) => s + (p.price || 0), 0);
  const totalViews = properties.reduce((s, p) => s + p.views, 0);

  async function handleDelete(id: string) {
    if (!confirm("Delete this property?")) return;
    setProperties((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/properties/${id}`, { method: "DELETE" });
    } catch {
      // noop
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div className="fade-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>
              My Properties
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Welcome back, {user?.firstName || "there"} — manage your 3D listings
            </p>
          </div>
          <Link
            href="/upload"
            style={{
              padding: "10px 22px", borderRadius: 9, fontSize: 14, fontWeight: 500,
              background: "var(--orange)", color: "white", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            + Upload Property
          </Link>
        </div>

        {/* Stats strip */}
        {properties.length > 0 && (
          <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: "2rem" }}>
            {[
              { label: "Total Listings", value: properties.length, icon: "🏠" },
              { label: "Portfolio Value", value: formatPrice(totalValue), icon: "💰" },
              { label: "Total Views", value: totalViews.toLocaleString("en-IN"), icon: "👁" },
              { label: "3D Files", value: properties.filter(p => p.ply_url).length, icon: "📦" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "16px 18px",
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div>
                  <div className="syne" style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "var(--muted2)" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid / Empty state */}
        {properties.length === 0 ? (
          <div
            className="fade-up-2"
            style={{
              border: "2px dashed var(--border)",
              borderRadius: 20, padding: "6rem 2rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏠</div>
            <h2 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No properties yet</h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
              Upload your first 3D property listing to get started
            </p>
            <Link
              href="/upload"
              style={{
                padding: "12px 28px", borderRadius: 10, fontSize: 15, fontWeight: 500,
                background: "var(--orange)", color: "white", textDecoration: "none", display: "inline-block",
              }}
            >
              Upload Property
            </Link>
          </div>
        ) : (
          <div
            className="fade-up-2"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}
          >
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onView={setViewItem}
                showActions
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {viewItem && <ViewerModal property={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
}
