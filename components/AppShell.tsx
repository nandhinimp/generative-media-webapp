"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

function UserAvatar({ imageUrl, name }: { imageUrl?: string | null; name?: string | null }) {
  const initials = useMemo(() => {
    const source = name?.trim() || "User";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "U")
      .join("");
  }, [name]);

  if (imageUrl) {
    return <img src={imageUrl} alt={name || "User profile"} className="h-9 w-9 rounded-full border border-white/10 object-cover" />;
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/8 text-xs font-semibold text-zinc-100">
      {initials}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, loginWithGoogle, logout, error } = useAuth();

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[0.18em] text-zinc-100 uppercase">Generative Media</span>
            <span className="text-[11px] text-zinc-500">Personal AI creative workspace</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/previous-generated-images" className="hidden rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10 sm:inline-flex">
              Library
            </Link>
            <Link href="/saved-edited-images" className="hidden rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10 sm:inline-flex">
              Saved Edits
            </Link>

            {loading ? (
              <div className="h-9 w-44 animate-pulse rounded-full border border-white/8 bg-white/5" />
            ) : user ? (
              <div className="flex items-center gap-3 rounded-full border border-white/8 bg-white/5 px-2 py-2">
                <UserAvatar imageUrl={user.photoURL} name={user.displayName} />
                <div className="hidden flex-col leading-tight sm:flex">
                  <span className="max-w-40 truncate text-sm text-zinc-100">{user.displayName || "Signed in"}</span>
                  <span className="max-w-40 truncate text-[11px] text-zinc-500">{user.email || "Google account"}</span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-50 transition hover:bg-cyan-500/20"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="border-b border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <p>{error}</p>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>
    </div>
  );
}