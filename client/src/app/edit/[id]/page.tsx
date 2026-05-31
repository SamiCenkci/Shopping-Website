"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function EditListingPage() {
  const params = useParams();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/api/listings/${params.id}`)
      .then((data) => {
        setForm({
          title: data.title,
          description: data.description,
          price: String(data.price_ore / 100),
          category: data.category,
          condition: data.condition,
          county: data.county,
          municipality: data.municipality,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api(`/api/listings/${params.id}`, {
        method: "PUT",
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
      router.push("/my-listings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit listing</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          rows={4}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price (kr)"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          required
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
          placeholder="County"
          value={form.county}
          onChange={(e) => update("county", e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Municipality"
          value={form.municipality}
          onChange={(e) => update("municipality", e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
        >
          Save changes
        </button>
      </form>
    </main>
  );
}