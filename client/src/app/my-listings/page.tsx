"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Listing = {
  id: string;
  title: string;
  price_ore: number;
  category: string;
};

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    if (!confirm("Delete this listing?")) return;
    try {
      await api(`/api/listings/${id}`, { method: "DELETE" });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">You have no listings yet.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div>
                <h2 className="font-semibold">{listing.title}</h2>
                <p className="text-blue-600 font-bold text-sm">
                  {(listing.price_ore / 100).toLocaleString("nb-NO")} kr
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/edit/${listing.id}`)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}