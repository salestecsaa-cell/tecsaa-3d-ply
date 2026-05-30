"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

const STEPS = ["Select file", "Add details", "Upload"];

export default function UploadPage() {
  const router = useRouter();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [plyFile, setPlyFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const TAG_OPTIONS = ["interior", "exterior", "commercial", "heritage", "object", "space"];

  function toggleTag(t: string) {
    setTags((prev) => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setPlyFile(file); setStep(1); }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) { setPlyFile(file); setStep(1); }
  }

  async function handleSubmit() {
    if (!title || !plyFile || !user) return;
    setUploading(true);
    setError("");
    setStep(2);

    try {
      setProgress("Uploading 3D file to storage…");
      const ext = plyFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("ply-files")
        .upload(fileName, plyFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("ply-files")
        .getPublicUrl(fileName);

      setProgress("Saving property details…");
      const { error: dbError } = await supabase
        .from("properties")
        .insert({
          user_id: user.id,
          title,
          description,
          price: price ? parseFloat(price) : null,
          location,
          ply_url: publicUrl,
          tags,
        });
      if (dbError) throw dbError;

      setProgress("Done! Redirecting…");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Upload failed — check console");
      setUploading(false);
      setStep(1);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
        {/* Back */}
        <Link href="/dashboard" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: "1.5rem" }}>
          ← Back to My Properties
        </Link>

        <h1 className="syne fade-up" style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Upload Property</h1>
        <p className="fade-up-1" style={{ fontSize: 14, color: "var(--muted)", marginBottom: "2rem" }}>
          Add a new 3D Gaussian Splat real estate listing
        </p>

        {/* Step indicator */}
        <div className="fade-up-1" style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2rem" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i <= step ? "var(--orange)" : "var(--card2)",
                  color: i <= step ? "white" : "var(--muted2)",
                  border: `1px solid ${i <= step ? "var(--orange)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600,
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === step ? "var(--text)" : "var(--muted2)", whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 80, height: 1, background: i < step ? "var(--orange)" : "var(--border)", margin: "0 8px", marginBottom: 16 }} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#F87171", marginBottom: "1.5rem" }}>
            ⚠ {error}
          </div>
        )}

        <div className="fade-up-2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* File drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragging ? "var(--orange)" : plyFile ? "rgba(249,115,22,0.5)" : "var(--border)"}`,
              borderRadius: 16, padding: "2.5rem 2rem", textAlign: "center",
              background: dragging ? "rgba(249,115,22,0.04)" : plyFile ? "rgba(249,115,22,0.03)" : "var(--card)",
              transition: "all 0.2s", cursor: "pointer",
            }}
          >
            {plyFile ? (
              <div>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
                <div style={{ fontWeight: 600, color: "var(--orange)", marginBottom: 4 }}>{plyFile.name}</div>
                <div style={{ fontSize: 13, color: "var(--muted2)", marginBottom: 12 }}>{(plyFile.size / 1024 / 1024).toFixed(1)} MB</div>
                <button onClick={() => { setPlyFile(null); setStep(0); }} style={{ fontSize: 12, color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
                  Remove file
                </button>
              </div>
            ) : (
              <label style={{ cursor: "pointer" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>☁</div>
                <div style={{ fontWeight: 500, marginBottom: 6 }}>Drop your .ply or .splat file here</div>
                <div style={{ fontSize: 13, color: "var(--muted2)", marginBottom: 12 }}>or click to browse</div>
                <span style={{ fontSize: 12, color: "var(--orange)", borderBottom: "1px solid var(--orange)" }}>Browse file</span>
                <input type="file" accept=".ply,.splat,.ksplat" onChange={handleFileSelect} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Form fields */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 6, display: "block" }}>Property Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px", fontSize: 14,
                background: "var(--card2)", border: "1px solid var(--border)",
                borderRadius: 9, color: "var(--text)", outline: "none",
              }}
              placeholder="e.g. Modern Villa, Vijay Nagar"
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 6, display: "block" }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "10px 14px", fontSize: 14,
                background: "var(--card2)", border: "1px solid var(--border)",
                borderRadius: 9, color: "var(--text)", outline: "none", resize: "vertical",
                fontFamily: "inherit",
              }}
              placeholder="Describe the property — BHK, amenities, highlights…"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 6, display: "block" }}>Price (₹)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                min="0"
                style={{
                  width: "100%", padding: "10px 14px", fontSize: 14,
                  background: "var(--card2)", border: "1px solid var(--border)",
                  borderRadius: 9, color: "var(--text)", outline: "none",
                }}
                placeholder="e.g. 12500000"
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 6, display: "block" }}>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", fontSize: 14,
                  background: "var(--card2)", border: "1px solid var(--border)",
                  borderRadius: 9, color: "var(--text)", outline: "none",
                }}
                placeholder="e.g. Vijay Nagar, Indore"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 8, display: "block" }}>Tags</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["interior", "exterior", "commercial", "heritage", "object", "space"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  style={{
                    padding: "5px 14px", borderRadius: 20, fontSize: 13,
                    background: tags.includes(t) ? "rgba(249,115,22,0.15)" : "var(--card2)",
                    color: tags.includes(t) ? "var(--orange)" : "var(--muted)",
                    border: `1px solid ${tags.includes(t) ? "rgba(249,115,22,0.3)" : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!title || !plyFile || uploading}
            style={{
              width: "100%", padding: "14px", borderRadius: 10,
              fontSize: 15, fontWeight: 600,
              background: !title || !plyFile || uploading ? "var(--card2)" : "var(--orange)",
              color: !title || !plyFile || uploading ? "var(--muted2)" : "white",
              border: "none", cursor: !title || !plyFile || uploading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {uploading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                {progress || "Uploading…"}
              </span>
            ) : (
              "Upload Property →"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
