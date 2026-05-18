"use client";

import React from "react";
import { Generation } from "../types/generation";
import ImageCard from "./ImageCard";

type Props = {
  generations: Generation[];
  favorites: Record<number, boolean>;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (url: string, filename?: string) => void;
  onOpenFullscreen: (g: Generation) => void;
  onCreateVariation?: (prompt: string) => void;
};

export default function GalleryGrid({ generations, favorites, onToggleFavorite, onDelete, onDownload, onOpenFullscreen, onCreateVariation }: Props) {
  return (
    <div className="mt-8 mx-auto max-w-6xl">
      {generations.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-2xl bg-white/3 border border-dashed border-white/6 glass">
          <h3 className="text-xl font-medium text-zinc-100 mb-2">No generations yet</h3>
          <p className="text-zinc-400">Your created images will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {generations.map((g) => (
            <ImageCard
              key={g.id}
              generation={g}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDelete}
              onDownload={onDownload}
              onOpenFullscreen={onOpenFullscreen}
              onCreateVariation={onCreateVariation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
