"use client";

import { EditorTextItem } from "@/types/editor";

type Props = {
  text: EditorTextItem | null;
  onAddText: () => void;
  onUpdate: (patch: Partial<EditorTextItem>) => void;
  onDelete: () => void;
};

const fontStyles: Array<EditorTextItem["fontStyle"]> = ["normal", "bold", "italic", "bold italic"];

export default function TextControls({ text, onAddText, onUpdate, onDelete }: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4 shadow-xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Text Controls</h3>
          <p className="text-xs text-zinc-500">Add a draggable text layer and style it.</p>
        </div>

        <button
          onClick={onAddText}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
        >
          Add Text
        </button>
      </div>

      {!text ? (
        <p className="text-sm text-zinc-500">Select a text layer to edit its content, color, and size.</p>
      ) : (
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs text-zinc-400">Text</span>
            <textarea
              value={text.text}
              onChange={(event) => onUpdate({ text: event.target.value })}
              rows={3}
              className="w-full rounded-2xl border border-white/8 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-white/20"
            />
          </label>

          <label className="block space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Font Size</span>
              <span>{text.fontSize}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={128}
              step={1}
              value={text.fontSize}
              onChange={(event) => onUpdate({ fontSize: Number(event.target.value) })}
              className="w-full accent-cyan-400"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs text-zinc-400">Color</span>
            <input
              type="color"
              value={text.color}
              onChange={(event) => onUpdate({ color: event.target.value })}
              className="h-11 w-full rounded-2xl border border-white/8 bg-black/30 p-1"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs text-zinc-400">Style</span>
            <div className="grid grid-cols-2 gap-2">
              {fontStyles.map((fontStyle) => (
                <button
                  key={fontStyle}
                  onClick={() => onUpdate({ fontStyle })}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    text.fontStyle === fontStyle
                      ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-100"
                      : "border-white/8 bg-white/5 text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  {fontStyle}
                </button>
              ))}
            </div>
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-100 transition hover:bg-red-500/20"
            >
              Delete Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
