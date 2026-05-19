"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GenerationOptions } from "../types/generation";
import { generateImage as serviceGenerateImage } from "../services/generation.service";
import PromptInput from "./PromptInput";
import GenerationSettings from "./GenerationSettings";
import { useAuth } from "@/hooks/useAuth";
import AuthPrompt from "./AuthPrompt";

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
  const { user, loading: authLoading } = useAuth();
  const [prompt, setPrompt] = useState(initialPrompt ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(defaultGenerationOptions);

  async function handleGenerate() {
    if (!user) {
      setError("Sign in with Google to generate images.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await serviceGenerateImage(prompt, generationOptions);
      setPrompt("");

      if ("imageUrl" in data && data.imageUrl) {
        const params = new URLSearchParams();
        params.set("image", data.imageUrl);
        params.set("prompt", prompt);
        if ("id" in data && data.id != null) {
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

      <div className="relative">
        {/* Floating Auth Prompt overlay */}
        {!authLoading && !user && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-[3px] rounded-3xl">
            <div className="w-full max-w-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
              <AuthPrompt
                title="Sign in to start creating"
                description="Access your personal workspace to generate high-fidelity AI imagery, customize styles, and save edits."
              />
            </div>
          </div>
        )}

        {/* Workspace controls container (blurred if logged out) */}
        <div className={`${!authLoading && !user ? "blur-[5px] select-none pointer-events-none opacity-30 transition-all duration-500" : "transition-all duration-500"}`}>
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
            disabled={!user}
          />

          <GenerationSettings options={generationOptions} onChange={setGenerationOptions} />
        </div>
      </div>
    </div>
  );
}