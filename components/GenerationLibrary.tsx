"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Generation } from "../types/generation";
import { fetchGenerations, deleteGeneration as serviceDeleteGeneration } from "../services/generation.service";
import { downloadImage } from "../utils/downloadImage";
import { loadFavorites, toggleFavoriteLocal } from "../utils/favorites";
import { getRememberedWorkspaceUserId, loadCachedGenerations, rememberWorkspaceUserId, saveCachedGenerations } from "../utils/workspaceCache";
import GalleryGrid from "./GalleryGrid";
import FullscreenModal from "./FullscreenModal";
import { useAuth } from "@/hooks/useAuth";
import AuthPrompt from "./AuthPrompt";
import { LoadingGallery } from "./LoadingSkeletons";

type Props = {
  mode: "all" | "favorites";
  title: string;
  description: string;
};

export default function GenerationLibrary({ mode, title, description }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [selectedFullscreen, setSelectedFullscreen] = useState<Generation | null>(null);
  const [cachedUserId, setCachedUserId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const highlightedGeneration = useMemo(() => {
    const highlightId = searchParams.get("highlight");
    if (!highlightId) return null;

    return generations.find((generation) => String(generation.id) === highlightId) ?? null;
  }, [generations, searchParams]);

  const fullscreen = selectedFullscreen ?? highlightedGeneration;

  useEffect(() => {
    if (authLoading) return;

    const initialize = async () => {
      if (!user) {
        const rememberedUserId = getRememberedWorkspaceUserId();
        if (rememberedUserId) {
          setCachedUserId(rememberedUserId);
          setGenerations(loadCachedGenerations(rememberedUserId));
          setFavorites(loadFavorites(rememberedUserId));
        } else {
          setCachedUserId(null);
          setGenerations([]);
          setFavorites({});
        }

        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await fetchGenerations();
        setGenerations(data);
        setFavorites(loadFavorites(user.uid));
        setCachedUserId(user.uid);
        rememberWorkspaceUserId(user.uid);
        saveCachedGenerations(user.uid, data);
      } finally {
        setLoading(false);
      }
    };

    void initialize();
  }, [authLoading, user]);

  const visibleGenerations = useMemo(() => {
    if (mode === "favorites") {
      return generations.filter((generation) => favorites[generation.id]);
    }

    return generations;
  }, [favorites, generations, mode]);

  function handleToggleFavorite(id: number) {
    setFavorites(toggleFavoriteLocal(id, user?.uid));
  }

  function handleCloseFullscreen() {
    setSelectedFullscreen(null);

    if (typeof window !== "undefined" && searchParams.get("highlight")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("highlight");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this generation? This cannot be undone.')) return;

    const previousGenerations = generations;
    const previousFullscreen = fullscreen;
    const wasFullscreenOpen = fullscreen?.id === id;

    setGenerations((currentGenerations) => currentGenerations.filter((generation) => generation.id !== id));
    if (wasFullscreenOpen) setSelectedFullscreen(null);

    try {
      const deleted = await serviceDeleteGeneration(id);
      if (!deleted) {
        setGenerations(previousGenerations);
        if (wasFullscreenOpen) setSelectedFullscreen(previousFullscreen);
      } else if (user?.uid) {
        saveCachedGenerations(user.uid, previousGenerations.filter((generation) => generation.id !== id));
      }
    } catch (error) {
      console.error(error);
      setGenerations(previousGenerations);
      if (wasFullscreenOpen) setSelectedFullscreen(previousFullscreen);
    }
  }

  async function handleDownload(url: string, filename?: string) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error("Download failed", error);
    }
  }

  const showCachedWorkspace = !user && cachedUserId && generations.length > 0;

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
            <Link href="/saved-edited-images" className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
              Saved Edits
            </Link>
          </div>
        </div>
      </div>

      {!authLoading && !user && !showCachedWorkspace ? (
        <AuthPrompt
          title="Your library is private"
          description="Sign in with Google to view your own generations, favorites, and editing history."
        />
      ) : loading ? (
        <LoadingGallery />
      ) : (
        <>
          {showCachedWorkspace && (
            <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-50">
              Showing the last synced workspace from this device. Sign in again to refresh it from your account.
            </div>
          )}

          <GalleryGrid
            generations={visibleGenerations}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onOpenFullscreen={(generation) => setSelectedFullscreen(generation)}
            onCreateVariation={(prompt) => {
              if (typeof window !== "undefined") {
                window.location.href = `/?prompt=${encodeURIComponent(prompt)}`;
              }
            }}
          />

          <FullscreenModal
            generation={fullscreen}
            onClose={handleCloseFullscreen}
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
