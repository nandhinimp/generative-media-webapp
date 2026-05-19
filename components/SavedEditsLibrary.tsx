"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SavedEdit } from "../types/generation";
import { deleteSavedEdit as serviceDeleteSavedEdit, fetchSavedEdits } from "../services/generation.service";
import { downloadImage } from "../utils/downloadImage";
import { getRememberedWorkspaceUserId, loadCachedSavedEdits, rememberWorkspaceUserId, saveCachedSavedEdits } from "../utils/workspaceCache";
import GalleryGrid from "./GalleryGrid";
import FullscreenModal from "./FullscreenModal";
import { useAuth } from "@/hooks/useAuth";
import AuthPrompt from "./AuthPrompt";
import { LoadingGallery } from "./LoadingSkeletons";

type Props = {
  title: string;
  description: string;
};

export default function SavedEditsLibrary({ title, description }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [savedEdits, setSavedEdits] = useState<SavedEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFullscreen, setSelectedFullscreen] = useState<SavedEdit | null>(null);
  const [cachedUserId, setCachedUserId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const highlightedSavedEdit = useMemo(() => {
    const highlightId = searchParams.get("highlight");
    if (!highlightId) return null;

    return savedEdits.find((savedEdit) => String(savedEdit.id) === highlightId) ?? null;
  }, [savedEdits, searchParams]);

  const fullscreen = selectedFullscreen ?? highlightedSavedEdit;

  useEffect(() => {
    if (authLoading) return;

    const initialize = async () => {
      if (!user) {
        const rememberedUserId = getRememberedWorkspaceUserId();
        if (rememberedUserId) {
          setCachedUserId(rememberedUserId);
          setSavedEdits(loadCachedSavedEdits(rememberedUserId));
        } else {
          setCachedUserId(null);
          setSavedEdits([]);
        }

        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await fetchSavedEdits();
        setSavedEdits(data);
        setCachedUserId(user.uid);
        rememberWorkspaceUserId(user.uid);
        saveCachedSavedEdits(user.uid, data);
      } finally {
        setLoading(false);
      }
    };

    void initialize();
  }, [authLoading, user]);

  const visibleSavedEdits = useMemo(() => savedEdits, [savedEdits]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this saved edit? This cannot be undone.")) return;

    const previousSavedEdits = savedEdits;
    const previousFullscreen = fullscreen;
    const wasFullscreenOpen = fullscreen?.id === id;

    setSavedEdits((current) => current.filter((savedEdit) => savedEdit.id !== id));
    if (wasFullscreenOpen) setSelectedFullscreen(null);

    try {
      const deleted = await serviceDeleteSavedEdit(id);
      if (!deleted) {
        setSavedEdits(previousSavedEdits);
        if (wasFullscreenOpen) setSelectedFullscreen(previousFullscreen);
      } else if (user?.uid) {
        saveCachedSavedEdits(user.uid, previousSavedEdits.filter((savedEdit) => savedEdit.id !== id));
      }
    } catch (error) {
      console.error(error);
      setSavedEdits(previousSavedEdits);
      if (wasFullscreenOpen) setSelectedFullscreen(previousFullscreen);
    }
  }

  const showCachedWorkspace = !user && cachedUserId && savedEdits.length > 0;

  async function handleDownload(url: string, filename?: string) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error("Download failed", error);
    }
  }

  function handleCloseFullscreen() {
    setSelectedFullscreen(null);

    if (typeof window !== "undefined" && searchParams.get("highlight")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("highlight");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
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

      {!authLoading && !user && !showCachedWorkspace ? (
        <AuthPrompt
          title="Saved edits are private"
          description="Sign in to view the edited images created in your workspace."
        />
      ) : loading ? (
        <LoadingGallery />
      ) : (
        </div>
      ) : (
        <>
          {showCachedWorkspace && (
            <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-50">
              Showing the last synced saved edits from this device. Sign in again to refresh them from your account.
            </div>
          )}

          <GalleryGrid
            generations={visibleSavedEdits}
            favorites={{}}
            onToggleFavorite={() => {}}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onOpenFullscreen={(savedEdit) => setSelectedFullscreen(savedEdit as SavedEdit)}
          />

          <FullscreenModal
            generation={fullscreen}
            onClose={handleCloseFullscreen}
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