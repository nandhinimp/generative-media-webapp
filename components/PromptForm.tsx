"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Generation, GenerationOptions } from "../types/generation";
import { generateImage as serviceGenerateImage } from "../services/generation.service";
import PromptInput from "./PromptInput";
import GenerationSettings from "./GenerationSettings";

const defaultGenerationOptions: GenerationOptions = {
  aspectRatio: "square",
  stylePreset: "none",
  creativity: "balanced",
  strictness: "balanced",
};

type Props = {
  initialPrompt?: string;
};

export default function PromptForm({ initialPrompt }: Props) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(defaultGenerationOptions);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  async function handleGenerate() {
    try {
      setLoading(true);
      setError("");
      const data: any = await serviceGenerateImage(prompt, generationOptions);
      setPrompt("");

      if (data?.imageUrl) {
        const params = new URLSearchParams();
        params.set("image", data.imageUrl);
        params.set("prompt", prompt);
        if (data?.id != null) {
          params.set("id", String(data.id));
        }

        router.push(`/showcase?${params.toString()}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate image');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-0">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-full border border-white/8 bg-black/30 px-4 py-3 text-sm text-zinc-300 backdrop-blur-md">
        <div>
          <span className="font-medium text-zinc-100">Generation Studio</span>
          <span className="ml-2 text-zinc-500">Quick controls for prompt, style, and framing</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/previous-generated-images" className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
            Previous Images
          </Link>
          <Link href="/favorites" className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
            Favorites
          </Link>
        </div>
      </div>

      <PromptInput prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} loading={loading} error={error} />

      <GenerationSettings options={generationOptions} onChange={setGenerationOptions} />
    </div>
  );
}