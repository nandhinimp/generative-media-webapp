import { Suspense } from "react";
import SavedEditsLibrary from "@/components/SavedEditsLibrary";

export default function SavedEditedImagesPage() {
  return (
    <main className="min-h-screen py-6 text-white sm:py-8">
      <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-6 text-zinc-400">Loading saved edits…</div>}>
        <SavedEditsLibrary
          title="Saved Edits"
          description="Edited images are stored separately here, leaving the original generation history untouched."
        />
      </Suspense>
    </main>
  );
}