"use client";

import React from "react";

type Props = {
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  loading: boolean;
  error?: string;
};

export default function PromptInput({ prompt, setPrompt, onGenerate, loading, error }: Props) {
  return (
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
              onClick={onGenerate}
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
    </div>
  );
}
