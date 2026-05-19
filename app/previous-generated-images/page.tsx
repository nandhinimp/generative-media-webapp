import { Suspense } from "react";
import GenerationLibrary from "@/components/GenerationLibrary";

export default function PreviousGeneratedImagesPage() {
  return (
    <main className="min-h-screen text-white py-6 sm:py-8">
      <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-6 text-zinc-400">Loading your library…</div>}>
        <GenerationLibrary
          mode="all"
          title="Previous Generated Images"
          description="Browse the full generation history stored in your workspace."
        />
      </Suspense>
    </main>
  );
}
