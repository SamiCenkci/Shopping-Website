"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    router.push("/");
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">Marketplace</a>
        <div className="flex items-center gap-4 text-sm">
        <a href="/search" className="text-gray-600 hover:text-black">Search</a>    
          {loggedIn ? (
            <>
              <a href="/new" className="text-blue-600">Post item</a> 
              <a href="/my-listings" className="text-gray-600 hover:text-black">My listings</a>
              <button onClick={logout} className="text-gray-600 hover:text-black">
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-blue-600">Log in</a>
              <a href="/signup" className="text-blue-600">Sign up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
