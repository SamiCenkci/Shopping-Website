"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "good",
    county: "",
    municipality: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/api/listings", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price_ore: Math.round(parseFloat(form.price) * 100),
          category: form.category,
          condition: form.condition,
          county: form.county,
          municipality: form.municipality,
        }),
      });
      router.push("/"); // back to homepage to see it
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Post a new item</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Title" value={form.title}
          onChange={(e) => update("title", e.target.value)} required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Description" value={form.description}
          onChange={(e) => update("description", e.target.value)} required
          className="w-full border rounded px-3 py-2" rows={4}
        />
        <input
          type="number" step="0.01" placeholder="Price (kr)" value={form.price}
          onChange={(e) => update("price", e.target.value)} required
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Category (e.g. furniture)" value={form.category}
          onChange={(e) => update("category", e.target.value)} required
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={form.condition}
          onChange={(e) => update("condition", e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="new">New</option>
          <option value="like_new">Like new</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
        <input
          placeholder="County (e.g. Oslo)" value={form.county}
          onChange={(e) => update("county", e.target.value)} required
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Municipality (e.g. Oslo)" value={form.municipality}
          onChange={(e) => update("municipality", e.target.value)} required
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post item"}
        </button>
      </form>
    </main>
  );
}