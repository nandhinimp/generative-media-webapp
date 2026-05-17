"use client";

import { useEffect, useState } from "react";

type Generation = {
  id: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [fullscreen, setFullscreen] = useState<Generation | null>(null);

  async function fetchGenerations() {
    try {
      const response = await fetch("/api/generations");

      if (!response.ok) {
        throw new Error(`Failed to fetch generations: ${response.status}`);
      }

      const data = await response.json();
      setGenerations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setInitialLoad(false);
    }
  }

  useEffect(() => {
    fetchGenerations();
    try {
      const raw = localStorage.getItem('favorites');
      if (raw) setFavorites(JSON.parse(raw));
    } catch (e) {}
  }, []);

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setPrompt("");

      if (data.imageUrl) {
        setGenerations((currentGenerations) => [
          data,
          ...currentGenerations,
        ]);
      } else {
        await fetchGenerations();
      }
    } catch (error) {
      console.error(error);
      setError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  }

  function toggleFavorite(id: number) {
    setFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('favorites', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this generation? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/generations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setGenerations((g) => g.filter((x) => x.id !== id));
      if (fullscreen?.id === id) setFullscreen(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete generation');
    }
  }

  async function handleDownload(url: string, filename?: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = filename || 'image.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error('Download failed', err);
    }
  }

  // Fullscreen modal markup is rendered below the main return via portal-like element

  return (
    <>
    <div className="w-full mt-6 md:mt-10">
      <div className="mx-auto max-w-4xl">
        <div className="glass p-6 rounded-2xl border border-white/6 shadow-xl">
          <label className="text-sm text-zinc-400 mb-2 block">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want..."
            className="w-full bg-transparent rounded-xl p-4 min-h-[140px] outline-none resize-none text-zinc-100 placeholder:text-zinc-500 border border-white/4 focus:border-transparent focus:ring-2 focus:ring-offset-0 focus:ring-purple-600/40 transition-all"
          />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/8 p-2 rounded-lg border border-red-400/10 mr-auto">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="btn-gradient text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 mx-auto max-w-6xl">
        {!initialLoad && generations.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-2xl bg-white/3 border border-dashed border-white/6 glass">
            <h3 className="text-xl font-medium text-zinc-100 mb-2">No generations yet</h3>
            <p className="text-zinc-400">Your created images will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {generations.map((generation) => (
              <article key={generation.id} className="group rounded-2xl overflow-hidden glass border border-white/6 shadow-lg transform transition-all duration-300 hover:scale-102 hover:shadow-2xl">
                <div className="relative overflow-hidden w-full h-80 sm:h-96 bg-black cursor-zoom-in" onClick={() => setFullscreen(generation)}>
                  <img src={generation.imageUrl} alt={generation.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-zinc-100 font-medium line-clamp-2" title={generation.prompt}>{generation.prompt}</p>
                      <p className="text-xs text-zinc-400 mt-1">{new Date(generation.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => toggleFavorite(generation.id)} className="btn-icon" title="Toggle favorite">
                        {favorites[generation.id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD166" className="text-yellow-300">
                            <path d="M12 .587l3.668 7.431L23.4 9.6l-5.6 5.455L19.336 24 12 20.202 4.664 24l1.536-8.945L.6 9.6l7.732-1.582L12 .587z"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-zinc-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                          </svg>
                        )}
                      </button>

                      <button onClick={() => handleDelete(generation.id)} className="btn-icon" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-200">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-w-[90vw] max-h-[90vh] w-full relative">
            <img src={fullscreen.imageUrl} alt={fullscreen.prompt} className="w-full h-full object-contain rounded-lg" />

            <div className="absolute top-3 right-3 flex gap-2">
              <button className="btn-icon" onClick={() => handleDownload(fullscreen.imageUrl, `generation-${fullscreen.id}.jpg`)} title="Download">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4-4-4M21 21H3" />
                </svg>
              </button>

              <button className="btn-icon" onClick={() => toggleFavorite(fullscreen.id)} title="Favorite">
                {favorites[fullscreen.id] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD166" className="text-yellow-300">
                    <path d="M12 .587l3.668 7.431L23.4 9.6l-5.6 5.455L19.336 24 12 20.202 4.664 24l1.536-8.945L.6 9.6l7.732-1.582L12 .587z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                )}
              </button>

              <button className="btn-icon" onClick={() => { handleDelete(fullscreen.id); }} title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" />
                </svg>
              </button>

              <button className="btn-icon" onClick={() => setFullscreen(null)} title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-100">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}