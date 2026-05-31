"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    router.push("/");
  }

  function search(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <div className="max-w-[1400px] mx-auto px-[5%] py-3 flex items-center gap-4">
        <button onClick={() => router.push("/")} className="text-2xl font-bold text-brand shrink-0">
          Rego
        </button>

        <form onSubmit={search} className="flex-1 max-w-xl flex">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk etter varer, biler, eiendom..."
            className="flex-1 px-4 py-2 rounded-l-lg border border-line border-r-0 bg-surface text-ink outline-none focus:border-brand"
          />
          <button type="submit" className="px-5 py-2 rounded-r-lg bg-brand text-white font-medium hover:bg-brand-dark">
            Søk
          </button>
        </form>

        <div className="flex items-center gap-3 text-sm shrink-0">
          {loggedIn ? (
            <>
              <button onClick={() => router.push("/my-listings")} className="text-ink-secondary hover:text-brand">
                Mine annonser
              </button>
              <button onClick={() => router.push("/new")} className="px-3 py-1.5 rounded-lg text-white font-medium bg-brand hover:bg-brand-dark">
                + Ny annonse
              </button>
              <button onClick={logout} className="text-ink-secondary hover:text-brand">
                Logg ut
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/login")} className="text-ink-secondary hover:text-brand">
                Logg inn
              </button>
              <button onClick={() => router.push("/signup")} className="px-3 py-1.5 rounded-lg text-white font-medium bg-brand hover:bg-brand-dark">
                Registrer
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}