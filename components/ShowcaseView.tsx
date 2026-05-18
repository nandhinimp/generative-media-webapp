"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ShowcaseView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const image = searchParams.get("image") || "";
  const prompt = searchParams.get("prompt") || "";
  const id = searchParams.get("id") || "";

  const backHref = id ? "/previous-generated-images" : "/";
  const editHref = prompt ? `/?prompt=${encodeURIComponent(prompt)}` : "/";

  return (
    <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/3 p-4 glass sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Generated Image Showcase</h1>
          <p className="mt-1 text-sm text-zinc-400">Use the buttons below to go back or edit the prompt.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10"
          >
            Back
          </button>

          <Link
            href={editHref}
            className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10"
          >
            Edit Prompt
          </Link>

          <Link
            href={backHref}
            className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10"
          >
            Open Library
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-3xl border border-white/8 bg-black/40 p-4 shadow-2xl sm:p-8">
        {image ? (
          <img
            src={image}
            alt={prompt || "Generated image"}
            className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <div className="text-center text-zinc-400">No image was provided.</div>
        )}
      </div>

      {prompt && (
        <div className="mt-4 rounded-2xl border border-white/8 bg-white/3 p-4 text-sm text-zinc-300 glass">
          <span className="text-zinc-500">Prompt:</span> {prompt}
        </div>
      )}
    </section>
  );
}
