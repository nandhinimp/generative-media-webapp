"use client";

import React from "react";
import Link from "next/link";
import { Generation } from "../types/generation";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  generation: Generation;
  favorites: Record<number, boolean>;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (url: string, filename?: string) => void;
  onOpenFullscreen: (g: Generation) => void;
  onCreateVariation?: (prompt: string) => void;
};

export default function ImageCard({
  generation,
  favorites,
  onToggleFavorite,
  onDelete,
  onDownload,
  onOpenFullscreen,
  onCreateVariation,
}: Props) {
  const { user } = useAuth();
  const editHref = `/editor/${generation.id}?image=${encodeURIComponent(generation.imageUrl)}&prompt=${encodeURIComponent(generation.prompt)}`;

  return (
    <article className="group rounded-2xl overflow-hidden glass border border-white/6 shadow-lg transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl flex flex-col h-full bg-zinc-950/40">
      {/* Image Container */}
      <div 
        className="relative overflow-hidden w-full h-80 sm:h-96 bg-zinc-900 cursor-zoom-in flex-shrink-0" 
        onClick={() => onOpenFullscreen(generation)}
      >
        <img 
          src={generation.imageUrl} 
          alt={generation.prompt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
        />

        {/* Beautiful Floating Horizontal Glassmorphic Action Bar (Only visible to authenticated users on hover) */}
        {user && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row flex-nowrap items-center gap-1.5 bg-black/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl z-20"
            onClick={(e) => e.stopPropagation()} // Stop modal from opening when clicking action bar
          >
            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(generation.id)}
              className="btn-icon !h-8 !w-8 !rounded-full border border-white/5 bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all duration-200"
              title="Favorite"
              aria-label="Favorite"
            >
              {favorites[generation.id] ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFD166" className="text-yellow-300">
                  <path d="M12 .587l3.668 7.431L23.4 9.6l-5.6 5.455L19.336 24 12 20.202 4.664 24l1.536-8.945L.6 9.6l7.732-1.582L12 .587z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={() => onDownload(generation.imageUrl, `generation-${generation.id}.jpg`)}
              className="btn-icon !h-8 !w-8 !rounded-full border border-white/5 bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all duration-200"
              title="Download"
              aria-label="Download"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-zinc-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4-4-4M21 21H3" />
              </svg>
            </button>

            {/* Edit Button */}
            <Link
              href={editHref}
              className="btn-icon !h-8 !w-8 !rounded-full border border-white/5 bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all duration-200"
              title="Edit in Canvas"
              aria-label="Edit in Canvas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.1 2.1 0 113 2.97L7.5 18.819 3 20l1.18-4.5L16.862 3.487z" />
              </svg>
            </Link>

            {/* Variation/Regenerate Button */}
            {onCreateVariation && (
              <button
                onClick={() => onCreateVariation(generation.prompt)}
                className="btn-icon !h-8 !w-8 !rounded-full border border-white/5 bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all duration-200"
                title="Create Variation"
                aria-label="Create Variation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm9-4v4l3 3" />
                </svg>
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={() => onDelete(generation.id)}
              className="btn-icon !h-8 !w-8 !rounded-full border border-red-500/20 bg-red-950/10 hover:bg-red-500/25 flex items-center justify-center transition-all duration-200"
              title="Delete"
              aria-label="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1">
          <p className="text-sm text-zinc-100 font-semibold line-clamp-2 leading-relaxed" title={generation.prompt}>
            {generation.prompt}
          </p>
          <p className="text-[11px] text-zinc-500 font-medium">
            {new Date(generation.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </article>
  );
}
