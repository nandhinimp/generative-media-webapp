"use client";

import { useState } from "react";
import { AspectRatio, CreativityLevel, GenerationOptions, PromptStrictness, StylePreset } from "@/types/generation";

interface AdvancedControlsProps {
  options: GenerationOptions;
  onChange: (options: GenerationOptions) => void;
}

export default function AdvancedControls({ options, onChange }: AdvancedControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRatioChange = (aspectRatio: AspectRatio) => {
    onChange({ ...options, aspectRatio });
  };

  const handleStyleChange = (stylePreset: StylePreset) => {
    onChange({ ...options, stylePreset });
  };

  const handleCreativityChange = (creativity: CreativityLevel) => {
    onChange({ ...options, creativity });
  };

  const handleStrictnessChange = (strictness: PromptStrictness) => {
    onChange({ ...options, strictness });
  };

  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-900/20 overflow-hidden transition-all duration-300">
      {/* Header Button to Toggle Collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/40 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4.5 h-4.5 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-zinc-300 uppercase">Advanced Options</span>
        </div>
        <span className="text-xs text-zinc-500 font-medium">
          {isOpen ? "Hide configuration" : "Aspect ratio, style, strictness..."}
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] border-t border-zinc-800/80 p-5" : "max-h-0"
        } overflow-hidden`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Aspect Ratio */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {(["square", "portrait", "landscape"] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => handleRatioChange(ratio)}
                  className={`py-3 rounded-lg border text-sm font-medium transition-all capitalize flex flex-col items-center justify-center gap-2 ${
                    options.aspectRatio === ratio
                      ? "bg-white text-black border-transparent shadow-lg shadow-black/30"
                      : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-xs font-bold">{ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Presets */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Style Preset</label>
            <select
              value={options.stylePreset}
              onChange={(e) => handleStyleChange(e.target.value as StylePreset)}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg py-3 px-4 text-sm text-zinc-300 outline-none focus:border-zinc-600 transition-colors capitalize"
            >
              <option value="none">Default (None)</option>
              <option value="realistic">Realistic</option>
              <option value="anime">Anime</option>
              <option value="cinematic">Cinematic</option>
              <option value="fantasy">Fantasy</option>
              <option value="minimal">Minimal</option>
              <option value="3d_illustration">3D Illustration</option>
            </select>
          </div>

          {/* Creativity Slider */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Creativity Control ({options.creativity})
            </label>
            <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 p-1.5 border border-zinc-800 rounded-lg">
              {(["accurate", "balanced", "creative"] as CreativityLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleCreativityChange(level)}
                  className={`py-2 rounded-md text-xs font-semibold transition-all capitalize ${
                    options.creativity === level
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Strictness */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Prompt Strength ({options.strictness})
            </label>
            <div className="grid grid-cols-3 gap-2 bg-zinc-900/60 p-1.5 border border-zinc-800 rounded-lg">
              {(["strict", "balanced", "flexible"] as PromptStrictness[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleStrictnessChange(level)}
                  className={`py-2 rounded-md text-xs font-semibold transition-all capitalize ${
                    options.strictness === level
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
