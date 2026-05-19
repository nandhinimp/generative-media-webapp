import { Suspense } from "react";
import GenerationLibrary from "@/components/GenerationLibrary";

export default function FavoritesPage() {
  return (
    <main className="min-h-screen text-white py-6 sm:py-8">
      <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-6 text-zinc-400">Loading favorites…</div>}>
        <GenerationLibrary
          mode="favorites"
          title="Favorites"
          description="Images you marked as favorites are collected here for quick access."
        />
      </Suspense>
    </main>
  );
}
