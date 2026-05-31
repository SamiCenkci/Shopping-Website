"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6">Create account</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <input
          type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} required
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          type="password" placeholder="Password (min 8 chars)" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Log in</a>
        </p>
      </form>
    </div>
  );
}