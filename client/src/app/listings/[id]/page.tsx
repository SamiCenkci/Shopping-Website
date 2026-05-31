"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Image = { id: string; url: string };
type Listing = {
  id: string;
  title: string;
  description: string;
  price_ore: number;
  category: string;
  condition: string;
  county: string;
  municipality: string;
  images?: Image[];
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api(`/api/listings/${params.id}`)
      .then((data) => {
        setListing(data.listing);
        setImages(data.images ?? []);
        setSimilar(data.similar ?? []);
        window.scrollTo(0, 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="max-w-3xl mx-auto px-[5%] py-10 text-ink-secondary">Laster...</p>;
  if (error) return <p className="max-w-3xl mx-auto px-[5%] py-10 text-red-600">{error}</p>;
  if (!listing) return <p className="max-w-3xl mx-auto px-[5%] py-10">Annonse ikke funnet.</p>;

  return (
    <main className="max-w-5xl mx-auto px-[5%] py-8">
      <button onClick={() => router.push("/")} className="text-brand text-sm mb-4 hover:underline">
        ← Tilbake til annonser
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {images.length > 0 ? (
            <div className="space-y-2">
              <img src={images[0].url} alt={listing.title} className="w-full h-80 object-cover rounded-2xl" />
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1).map((img) => (
                    <img key={img.id} src={img.url} alt={listing.title} className="w-full h-20 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-80 rounded-2xl bg-subtle flex items-center justify-center text-ink-muted">
              Ingen bilde
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-ink">{listing.title}</h1>
          <p className="text-3xl text-brand font-bold mt-3">
            {(listing.price_ore / 100).toLocaleString("nb-NO")} kr
          </p>
          <div className="flex gap-2 mt-4 text-sm">
            <span className="bg-brand-lightest text-brand rounded-full px-3 py-1">{listing.category}</span>
            <span className="bg-subtle text-ink-secondary rounded-full px-3 py-1">{listing.condition}</span>
          </div>
          <p className="mt-5 text-ink whitespace-pre-wrap">{listing.description}</p>
          <div className="mt-5 pt-5 border-t border-line text-sm text-ink-secondary">
            <p>📍 {listing.municipality}, {listing.county}</p>
          </div>
          <button className="mt-6 w-full bg-brand text-white rounded-lg py-3 font-medium hover:bg-brand-dark">
            Send melding til selger
          </button>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-ink mb-5">Lignende annonser</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/listings/${s.id}`)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-36 w-full overflow-hidden bg-subtle">
                  {s.images && s.images.length > 0 ? (
                    <img src={s.images[0].url} alt={s.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-ink-muted">Ingen bilde</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate text-ink">{s.title}</h3>
                  <p className="font-semibold text-ink mt-0.5">
                    {(s.price_ore / 100).toLocaleString("nb-NO")} kr
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}