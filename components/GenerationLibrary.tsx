"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Generation } from "../types/generation";
import { fetchGenerations, deleteGeneration as serviceDeleteGeneration } from "../services/generation.service";
import { downloadImage } from "../utils/downloadImage";
import { loadFavorites, toggleFavoriteLocal } from "../utils/favorites";
import GalleryGrid from "./GalleryGrid";
import FullscreenModal from "./FullscreenModal";

type Props = {
  mode: "all" | "favorites";
  title: string;
  description: string;
};

export default function GenerationLibrary({ mode, title, description }: Props) {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [fullscreen, setFullscreen] = useState<Generation | null>(null);
  const searchParams = useSearchParams();

  async function load() {
    try {
      const data = await fetchGenerations();
      setGenerations(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    try {
      setFavorites(loadFavorites());
    } catch {
      setFavorites({});
    }
  }, []);

  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (!highlightId || generations.length === 0) return;

    const found = generations.find((generation) => String(generation.id) === highlightId);
    if (found) {
      setFullscreen(found);
    }
  }, [generations, searchParams]);

  const visibleGenerations = useMemo(() => {
    if (mode === "favorites") {
      return generations.filter((generation) => favorites[generation.id]);
    }

    return generations;
  }, [favorites, generations, mode]);

  function handleToggleFavorite(id: number) {
    setFavorites(toggleFavoriteLocal(id));
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this generation? This cannot be undone.')) return;

    const previousGenerations = generations;
    const previousFullscreen = fullscreen;
    const wasFullscreenOpen = fullscreen?.id === id;

    setGenerations((currentGenerations) => currentGenerations.filter((generation) => generation.id !== id));
    if (wasFullscreenOpen) setFullscreen(null);

    try {
      const deleted = await serviceDeleteGeneration(id);
      if (!deleted) {
        setGenerations(previousGenerations);
        if (wasFullscreenOpen) setFullscreen(previousFullscreen);
      }
    } catch (error) {
      console.error(error);
      setGenerations(previousGenerations);
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
    <section className="mx-auto max-w-6xl px-4 sm:px-0 py-6">
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
            generations={visibleGenerations}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onOpenFullscreen={(generation) => setFullscreen(generation)}
            onCreateVariation={(prompt) => {
              if (typeof window !== "undefined") {
                window.location.href = `/?prompt=${encodeURIComponent(prompt)}`;
              }
            }}
          />

          <FullscreenModal
            generation={fullscreen}
            onClose={() => setFullscreen(null)}
            onDownload={handleDownload}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            favorites={favorites}
          />
        </>
      )}
    </section>
  );
}
