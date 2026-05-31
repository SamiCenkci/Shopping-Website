"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price_ore: number;
  category: string;
  condition: string;
  county: string;
  municipality: string;
  created_at: string;
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/listings/${params.id}`)
      .then((data) => setListing(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!listing) return <p className="p-8">Listing not found.</p>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <button onClick={() => router.push("/")} className="text-blue-600 text-sm mb-4">
        ← Back to listings
      </button>

      <h1 className="text-3xl font-bold">{listing.title}</h1>
      <p className="text-2xl text-blue-600 font-bold mt-2">
        {(listing.price_ore / 100).toLocaleString("nb-NO")} kr
      </p>

      <div className="flex gap-2 mt-3 text-sm">
        <span className="bg-gray-100 rounded px-2 py-1">{listing.category}</span>
        <span className="bg-gray-100 rounded px-2 py-1">{listing.condition}</span>
      </div>

      <p className="mt-4 text-gray-700 whitespace-pre-wrap">{listing.description}</p>

      <p className="mt-4 text-gray-500 text-sm">
        Location: {listing.municipality}, {listing.county}
      </p>
    </main>
  );
}