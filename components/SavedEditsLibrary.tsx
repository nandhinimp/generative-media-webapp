"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SavedEdit } from "../types/generation";
import { deleteSavedEdit as serviceDeleteSavedEdit, fetchSavedEdits } from "../services/generation.service";
import { downloadImage } from "../utils/downloadImage";
import GalleryGrid from "./GalleryGrid";
import FullscreenModal from "./FullscreenModal";

type Props = {
  title: string;
  description: string;
};

export default function SavedEditsLibrary({ title, description }: Props) {
  const [savedEdits, setSavedEdits] = useState<SavedEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState<SavedEdit | null>(null);
  const searchParams = useSearchParams();

  async function load() {
    try {
      const data = await fetchSavedEdits();
      setSavedEdits(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (!highlightId || savedEdits.length === 0) return;

    const found = savedEdits.find((savedEdit) => String(savedEdit.id) === highlightId);
    if (found) {
      setFullscreen(found);
    }
  }, [savedEdits, searchParams]);

  const visibleSavedEdits = useMemo(() => savedEdits, [savedEdits]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this saved edit? This cannot be undone.")) return;

    const previousSavedEdits = savedEdits;
    const previousFullscreen = fullscreen;
    const wasFullscreenOpen = fullscreen?.id === id;

    setSavedEdits((current) => current.filter((savedEdit) => savedEdit.id !== id));
    if (wasFullscreenOpen) setFullscreen(null);

    try {
      const deleted = await serviceDeleteSavedEdit(id);
      if (!deleted) {
        setSavedEdits(previousSavedEdits);
        if (wasFullscreenOpen) setFullscreen(previousFullscreen);
      }
    } catch (error) {
      console.error(error);
      setSavedEdits(previousSavedEdits);
      if (wasFullscreenOpen) setFullscreen(previousFullscreen);
    }
  }

  async function handleDownload(url: string, filename?: string) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error("Download failed", error);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-0 sm:py-6">
      <div className="mb-6 rounded-2xl border border-white/8 bg-white/3 p-5 glass">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">{title}</h1>
            <p className="mt-1 text-sm text-zinc-400">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
              Home
            </Link>
            <Link href="/previous-generated-images" className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
              Previous Images
            </Link>
            <Link href="/favorites" className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
              Favorites
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-2xl border border-white/6 bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          <GalleryGrid
            generations={visibleSavedEdits}
            favorites={{}}
            onToggleFavorite={() => {}}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onOpenFullscreen={(savedEdit) => setFullscreen(savedEdit)}
          />

          <FullscreenModal
            generation={fullscreen}
            onClose={() => setFullscreen(null)}
            onDownload={handleDownload}
            onToggleFavorite={() => {}}
            onDelete={handleDelete}
            favorites={{}}
          />
        </>
      )}
    </section>
  );
}