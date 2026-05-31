"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function SearchPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    county: "",
    min_price: "",
    max_price: "",
    sort_by: "newest",
  });
  const [results, setResults] = useState<Listing[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        query: filters.query,
        category: filters.category,
        county: filters.county,
        min_price: filters.min_price ? Math.round(parseFloat(filters.min_price) * 100) : 0,
        max_price: filters.max_price ? Math.round(parseFloat(filters.max_price) * 100) : 0,
        sort_by: filters.sort_by,
      };
      const data = await api("/api/listings/search", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setResults(data ?? []);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Search listings</h1>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <input
          placeholder="Search words..."
          value={filters.query}
          onChange={(e) => update("query", e.target.value)}
          className="border rounded px-3 py-2 sm:col-span-2"
        />
        <input
          placeholder="Category"
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          placeholder="County"
          value={filters.county}
          onChange={(e) => update("county", e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Min price (kr)"
          value={filters.min_price}
          onChange={(e) => update("min_price", e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Max price (kr)"
          value={filters.max_price}
          onChange={(e) => update("max_price", e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={filters.sort_by}
          onChange={(e) => update("sort_by", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searched && results.length === 0 && (
        <p className="text-gray-500">No listings match your search.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((listing) => (
          <div
            key={listing.id}
            onClick={() => router.push(`/listings/${listing.id}`)}
            className="cursor-pointer border rounded-lg p-4 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{listing.title}</h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{listing.description}</p>
            <p className="text-blue-600 font-bold mt-2">
              {(listing.price_ore / 100).toLocaleString("nb-NO")} kr
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {listing.municipality}, {listing.county}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}