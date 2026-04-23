"use client";

import { useState, useMemo } from "react";
import type { Release } from "@/lib/spotify";
import type { CSSProperties } from "react";

const FONT = "Verdana, Geneva, Tahoma, sans-serif";

const th: CSSProperties = {
  textAlign: "left",
  padding: "6px 14px 6px 6px",
  fontWeight: "bold",
  color: "#ffffff",
  borderBottom: "2px solid #444",
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  padding: "11px 14px 11px 6px",
  verticalAlign: "middle",
  color: "#dddddd",
  borderBottom: "1px solid #222",
};

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw + (raw.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ReleasesTable({ releases }: { releases: Release[] }) {
  const [search, setSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState<string | null>(null);

  const artists = useMemo(() => {
    const seen = new Set<string>();
    releases.forEach((r) => r.artist.split(", ").forEach((a) => seen.add(a)));
    return Array.from(seen).sort();
  }, [releases]);

  const filtered = useMemo(() => {
    let list = releases;
    if (artistFilter) {
      list = list.filter((r) =>
        r.artist.toLowerCase().includes(artistFilter.toLowerCase())
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.artist.toLowerCase().includes(q) ||
          r.albumType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, artistFilter, releases]);

  return (
    <div
      style={{
        fontFamily: FONT,
        backgroundColor: "#0d0d0d",
        minHeight: "100vh",
        color: "#e0e0e0",
        padding: "18px 24px",
        fontSize: "13px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "24px", color: "#ffffff", marginTop: "24px" }}>
          571 hz
        </h2>

        <p style={{ marginBottom: "8px" }}>
          <a href="mailto:571hz@example.com" style={{ color: "#5cbf5c" }}>
            Contact
          </a>
        </p>

        {artists.length > 0 && (
          <p style={{ marginBottom: "10px" }}>
            <span>Filter (by artist): </span>
            {artists.map((a) => (
              <button
                key={a}
                onClick={() => setArtistFilter(artistFilter === a ? null : a)}
                style={{
                  marginRight: "6px",
                  padding: "2px 9px",
                  border: "1px solid #555",
                  backgroundColor: artistFilter === a ? "#2a5c2a" : "#181818",
                  color: "#e0e0e0",
                  cursor: "pointer",
                  fontFamily: FONT,
                  fontSize: "12px",
                }}
              >
                {a}
              </button>
            ))}
            {artistFilter && (
              <button
                onClick={() => setArtistFilter(null)}
                style={{
                  padding: "2px 9px",
                  border: "1px solid #555",
                  backgroundColor: "#181818",
                  color: "#e0e0e0",
                  cursor: "pointer",
                  fontFamily: FONT,
                  fontSize: "12px",
                }}
              >
                Clear Filter
              </button>
            )}
          </p>
        )}

        <p style={{ marginBottom: "14px" }}>
          <span>Search: </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              backgroundColor: "#0d0d0d",
              border: "1px solid #555",
              color: "#e0e0e0",
              padding: "1px 6px",
              fontSize: "13px",
              fontFamily: FONT,
              width: "220px",
              outline: "none",
            }}
          />
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111" }}>
              <th style={{ ...th, width: "120px" }}>Date</th>
              <th style={th}>Title</th>
              <th style={th}>Artist</th>
              <th style={th}>Type</th>
              <th style={th}>Links</th>
            </tr>
          </thead>
          <tbody>
            {releases.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...td, textAlign: "center", color: "#555", padding: "24px" }}>
                  Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local to load releases.
                </td>
              </tr>
            )}
            {filtered.length === 0 && releases.length > 0 && (
              <tr>
                <td colSpan={5} style={{ ...td, textAlign: "center", color: "#555", padding: "24px" }}>
                  No releases found.
                </td>
              </tr>
            )}
            {filtered.map((release, i) => (
              <tr key={release.id} style={{ backgroundColor: i % 2 === 0 ? "#1a1a1a" : "#111" }}>
                <td style={{ ...td, whiteSpace: "nowrap", color: "#aaa" }}>
                  {formatDate(release.date)}
                </td>
                <td style={td}>{release.title}</td>
                <td style={td}>{release.artist}</td>
                <td style={{ ...td, textTransform: "capitalize", color: "#aaa" }}>
                  {release.albumType}
                </td>
                <td style={td}>
                  <a
                    href={release.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#5cbf5c" }}
                  >
                    Spotify
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ marginTop: "24px", color: "#444", fontSize: "11px" }}>571 hz</p>
      </div>
    </div>
  );
}
