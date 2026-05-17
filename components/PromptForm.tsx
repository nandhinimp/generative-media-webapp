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

  async function fetchGenerations() {
    try {
      const response = await fetch("/api/generations");

      const data = await response.json();

      setGenerations(data);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchGenerations();
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

      await fetchGenerations();

    } catch (error) {
      console.error(error);

      setError("Failed to generate image");

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-16">

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want..."
          className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 min-h-32 outline-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="bg-white text-black px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

        {generations.map((generation) => (
          <div
            key={generation.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
          >

            <img
              src={generation.imageUrl}
              alt={generation.prompt}
              className="w-full h-80 object-cover"
            />

            <div className="p-4">

              <p className="text-sm text-zinc-300">
                {generation.prompt}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}