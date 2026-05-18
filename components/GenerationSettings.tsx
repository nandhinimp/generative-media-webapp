"use client";

import React from "react";
import {
  AspectRatio,
  CreativityLevel,
  GenerationOptions,
  PromptStrictness,
  StylePreset,
} from "../types/generation";

type Props = {
  options: GenerationOptions;
  onChange: (next: GenerationOptions) => void;
};

const styleOptions: Array<{ value: StylePreset; label: string; hint: string }> = [
  { value: "none", label: "Auto", hint: "Adaptive guidance" },
  { value: "realistic", label: "Realistic", hint: "Natural textures" },
  { value: "anime", label: "Anime", hint: "Illustration style" },
  { value: "cinematic", label: "Cinematic", hint: "Lighting and mood" },
  { value: "fantasy", label: "Fantasy", hint: "Magical scene" },
  { value: "fashion_editorial", label: "Fashion Editorial", hint: "Magazine composition" },
  { value: "minimal", label: "Minimal", hint: "Clean composition" },
  { value: "3d_illustration", label: "3D Illustration", hint: "Rendered depth" },
];

const ratioOptions: Array<{ value: AspectRatio; label: string; hint: string }> = [
  { value: "square", label: "Square", hint: "Balanced composition" },
  { value: "portrait", label: "Portrait", hint: "People and vertical framing" },
  { value: "landscape", label: "Landscape", hint: "Environments and scenery" },
];

const interpretationOptions: Array<{ value: PromptStrictness; label: string; hint: string }> = [
  { value: "strict", label: "Strict", hint: "Exact prompt match" },
  { value: "balanced", label: "Balanced", hint: "Moderate enhancement" },
  { value: "flexible", label: "Creative", hint: "Richer interpretation" },
];

export default function GenerationSettings({ options, onChange }: Props) {
  function update<K extends keyof GenerationOptions>(key: K, value: GenerationOptions[K]) {
    onChange({ ...options, [key]: value });
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/8 bg-white/3 p-4 shadow-lg backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Generation Settings</h3>
          <p className="text-xs text-zinc-400">Guide style, framing, and prompt interpretation</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SettingSelect
          label="Style"
          value={options.stylePreset}
          onChange={(value) => update("stylePreset", value as StylePreset)}
          options={styleOptions}
        />

        <SettingSelect
          label="Aspect Ratio"
          value={options.aspectRatio}
          onChange={(value) => update("aspectRatio", value as AspectRatio)}
          options={ratioOptions}
        />

        <SettingSelect
          label="Prompt Interpretation"
          value={options.strictness}
          onChange={(value) => update("strictness", value as PromptStrictness)}
          options={interpretationOptions}
        />
      </div>
    </div>
  );
}

function SettingSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; hint: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-white/8 bg-black/30 px-4 py-3 pr-10 text-sm text-zinc-100 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-purple-500/30"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" viewBox="0 0 20 20" fill="none">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        {options.find((option) => option.value === value)?.hint}
      </p>
    </label>
  );
}
