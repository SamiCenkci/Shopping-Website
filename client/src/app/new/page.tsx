"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: CATEGORIES[0],
    condition: "good",
    county: "",
    municipality: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(file: File): Promise<string> {
    const { upload_url, public_url } = await api("/api/uploads/presign", {
      method: "POST",
      body: JSON.stringify({ file_name: file.name, content_type: file.type }),
    });
    const res = await fetch(upload_url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("Bildeopplasting feilet");
    return public_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      for (const file of files) {
        imageUrls.push(await uploadFile(file));
      }
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
          images: imageUrls,
        }),
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke legge ut annonse");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-line rounded-lg px-3 py-2 outline-none focus:border-brand";

  return (
    <main className="max-w-lg mx-auto px-[5%] py-10">
      <h1 className="text-2xl font-semibold mb-6 text-ink">Legg ut ny annonse</h1>

      <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-2xl p-6 shadow-sm space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Tittel</label>
          <input value={form.title} onChange={(e) => update("title", e.target.value)} required className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Beskrivelse</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} required rows={4} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Pris (kr)</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} required className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Kategori</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Tilstand</label>
            <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className={inputClass}>
              <option value="new">Ny</option>
              <option value="like_new">Som ny</option>
              <option value="good">God</option>
              <option value="fair">Brukbar</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Fylke</label>
            <input value={form.county} onChange={(e) => update("county", e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Kommune</label>
            <input value={form.municipality} onChange={(e) => update("municipality", e.target.value)} required className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Bilder</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="w-full text-sm text-ink-secondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-lightest file:text-brand file:font-medium"
          />
          {files.length > 0 && (
            <p className="text-xs text-ink-muted mt-1">{files.length} bilde(r) valgt</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white rounded-lg py-2.5 font-medium hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? "Legger ut..." : "Legg ut annonse"}
        </button>
      </form>
    </main>
  );
}