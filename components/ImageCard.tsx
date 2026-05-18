"use client";

import React from "react";
import Link from "next/link";
import { Generation } from "../types/generation";

type Props = {
  generation: Generation;
  favorites: Record<number, boolean>;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (url: string, filename?: string) => void;
  onOpenFullscreen: (g: Generation) => void;
  onCreateVariation?: (prompt: string) => void;
};

export default function ImageCard({ generation, favorites, onToggleFavorite, onDelete, onDownload, onOpenFullscreen, onCreateVariation }: Props) {
  const editHref = `/editor/${generation.id}?image=${encodeURIComponent(generation.imageUrl)}&prompt=${encodeURIComponent(generation.prompt)}`;

  return (
    <article className="group rounded-2xl overflow-hidden glass border border-white/6 shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl">
      <div className="relative overflow-hidden w-full h-80 sm:h-96 bg-black cursor-zoom-in" onClick={() => onOpenFullscreen(generation)}>
        <img src={generation.imageUrl} alt={generation.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        <div className="absolute right-3 top-3 flex flex-row gap-2 rounded-full border border-white/10 bg-black/55 p-2 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={(event) => { event.stopPropagation(); onToggleFavorite(generation.id); }}
            className="btn-icon !h-9 !w-9 !rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            title="Toggle favorite"
            aria-label="Toggle favorite"
          >
            {favorites[generation.id] ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD166" className="text-yellow-300">
                <path d="M12 .587l3.668 7.431L23.4 9.6l-5.6 5.455L19.336 24 12 20.202 4.664 24l1.536-8.945L.6 9.6l7.732-1.582L12 .587z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
              </svg>
            )}
          </button>

          <button
            onClick={(event) => { event.stopPropagation(); onDownload(generation.imageUrl, `generation-${generation.id}.jpg`); }}
            className="btn-icon !h-9 !w-9 !rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            title="Download"
            aria-label="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4-4-4M21 21H3" />
            </svg>
          </button>

          <Link
            href={editHref}
            onClick={(event) => event.stopPropagation()}
            className="btn-icon !h-9 !w-9 !rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            title="Edit"
            aria-label="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.1 2.1 0 113 2.97L7.5 18.819 3 20l1.18-4.5L16.862 3.487z" />
            </svg>
          </Link>

          <button
            onClick={(event) => { event.stopPropagation(); onCreateVariation?.(generation.prompt); }}
            className="btn-icon !h-9 !w-9 !rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            title="Create variation"
            aria-label="Create variation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0zm9-4v4l3 3" />
            </svg>
          </button>

          <button
            onClick={(event) => { event.stopPropagation(); onDelete(generation.id); }}
            className="btn-icon !h-9 !w-9 !rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
            title="Delete"
            aria-label="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-zinc-100 font-medium line-clamp-2" title={generation.prompt}>{generation.prompt}</p>
            <p className="text-xs text-zinc-400 mt-1">{new Date(generation.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
