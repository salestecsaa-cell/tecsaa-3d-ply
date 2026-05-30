"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard", label: "My Properties" },
  { href: "/editor", label: "Editor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,11,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link href="/explore" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div
          style={{
            width: 32, height: 32,
            background: "var(--orange)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "white",
          }}
        >
          T
        </div>
        <span className="syne" style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px", color: "var(--text)" }}>
          TECSAA
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 14,
              color: pathname.startsWith(link.href) ? "var(--text)" : "var(--muted)",
              fontWeight: pathname.startsWith(link.href) ? 500 : 400,
              background: pathname.startsWith(link.href) ? "var(--card2)" : "transparent",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isSignedIn ? (
          <>
            <Link
              href="/upload"
              style={{
                padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: "var(--orange)", color: "white", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              + Upload Splat
            </Link>
            <UserButton afterSignOutUrl="/explore" />
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              style={{
                padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: "var(--card2)", color: "var(--text)", textDecoration: "none",
                border: "1px solid var(--border)",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              style={{
                padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: "var(--orange)", color: "white", textDecoration: "none",
              }}
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
