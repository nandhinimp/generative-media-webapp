import { Suspense } from "react";
import ShowcaseView from "@/components/ShowcaseView";

export default function ShowcasePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 text-zinc-400">Loading showcase…</div>}>
      <ShowcaseView />
    </Suspense>
  );
}
