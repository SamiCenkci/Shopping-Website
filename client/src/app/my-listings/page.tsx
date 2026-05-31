"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Image = { id: string; url: string };
type Listing = {
  id: string;
  title: string;
  price_ore: number;
  category: string;
  status: string;
  municipality: string;
  county: string;
  images?: Image[];
};

const TABS = [
  { key: "all", label: "Alle" },
  { key: "active", label: "Aktive" },
  { key: "sold", label: "Solgt" },
  { key: "expired", label: "Utløpt" },
];

const STATUS_LABEL: Record<string, string> = {
  active: "Aktiv",
  sold: "Solgt",
  expired: "Utløpt",
};

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  function load() {
    api("/api/listings/mine")
      .then((data) => setListings(data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Slette denne annonsen?")) return;
    try {
      await api(`/api/listings/${id}`, { method: "DELETE" });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Sletting feilet");
    }
  }

  async function setStatus(id: string, status: string) {
    try {
      await api(`/api/listings/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Kunne ikke oppdatere");
    }
  }

  const filtered = listings.filter((l) => {
    const matchesTab = tab === "all" || l.status === tab;
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  function countFor(key: string) {
    if (key === "all") return listings.length;
    return listings.filter((l) => l.status === key).length;
  }

  return (
    <main className="max-w-4xl mx-auto px-[5%] py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-ink">Mine annonser</h1>
        <button
          onClick={() => router.push("/new")}
          className="px-4 py-2 rounded-lg text-white font-medium bg-brand hover:bg-brand-dark text-sm"
        >
          + Ny annonse
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Søk i mine annonser..."
        className="w-full mb-4 px-4 py-2.5 rounded-lg border border-line bg-surface outline-none focus:border-brand"
      />

      <div className="flex gap-1 mb-6 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? "border-brand text-brand" : "border-transparent text-ink-secondary hover:text-ink"
            }`}
          >
            {t.label} <span className="text-ink-muted">({countFor(t.key)})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-secondary">Laster...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-line rounded-2xl p-10 text-center">
          <p className="text-ink-secondary">Ingen annonser her.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center gap-4 bg-surface border border-line rounded-xl p-3 shadow-sm"
            >
              <div
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="w-24 h-24 rounded-lg overflow-hidden bg-subtle shrink-0 cursor-pointer"
              >
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">
                    Ingen bilde
                  </div>
                )}
              </div>

              <div
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="flex-1 cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-ink truncate">{listing.title}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      listing.status === "active"
                        ? "bg-brand-lightest text-brand"
                        : listing.status === "sold"
                        ? "bg-subtle text-ink-secondary"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {STATUS_LABEL[listing.status] ?? listing.status}
                  </span>
                </div>
                <p className="text-brand font-semibold mt-1">
                  {(listing.price_ore / 100).toLocaleString("nb-NO")} kr
                </p>
                <p className="text-sm text-ink-secondary mt-0.5">
                  {listing.category} · {listing.municipality}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => router.push(`/edit/${listing.id}`)}
                  className="px-3 py-1 rounded-lg border border-line text-ink-secondary text-xs hover:border-brand hover:text-brand"
                >
                  Rediger
                </button>
                {listing.status !== "sold" ? (
                  <button
                    onClick={() => setStatus(listing.id, "sold")}
                    className="px-3 py-1 rounded-lg border border-line text-ink-secondary text-xs hover:border-brand hover:text-brand"
                  >
                    Marker solgt
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus(listing.id, "active")}
                    className="px-3 py-1 rounded-lg border border-line text-ink-secondary text-xs hover:border-brand hover:text-brand"
                  >
                    Aktiver
                  </button>
                )}
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="px-3 py-1 rounded-lg border border-line text-red-600 text-xs hover:bg-red-50"
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}