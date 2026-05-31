"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Listing = {
  id: string;
  title: string;
  description: string;
  price_ore: number;
  category: string;
  county: string;
  municipality: string;
};

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/listings")
      .then((data) => setListings(data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loading listings...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">No listings yet. Be the first to post!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <a key={listing.id} href={`/listings/${listing.id}`} className="block border rounded-lg p-4 hover:shadow-md transition">
              <h2 className="font-semibold text-lg">{listing.title}</h2>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{listing.description}</p>
              <p className="text-blue-600 font-bold mt-2">
                {(listing.price_ore / 100).toLocaleString("nb-NO")} kr
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {listing.municipality}, {listing.county}
              </p>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}