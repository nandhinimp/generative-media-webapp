"use client";

import { EditorImageTransform } from "@/types/editor";

type Props = {
  transform: EditorImageTransform;
  onChange: (patch: Partial<EditorImageTransform>) => void;
  onCenter: () => void;
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value?: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const safeValue = Number.isFinite(value) ? (value as number) : 0;

  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span>{safeValue.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-400"
      />
    </label>
  );
}

export default function ImageControls({ transform, onChange, onCenter }: Props) {
  const handleCropPreset = (preset: "reset" | "square" | "wide" | "portrait") => {
    if (preset === "reset") {
      onChange({ cropLeft: 0, cropTop: 0, cropRight: 0, cropBottom: 0 });
      return;
    }

    if (preset === "square") {
      onChange({ cropLeft: 0.08, cropTop: 0, cropRight: 0.08, cropBottom: 0 });
      return;
    }

    if (preset === "wide") {
      onChange({ cropLeft: 0.03, cropTop: 0.12, cropRight: 0.03, cropBottom: 0.12 });
      return;
    }

    onChange({ cropLeft: 0.12, cropTop: 0.03, cropRight: 0.12, cropBottom: 0.03 });
  };

  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4 shadow-xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Image Controls</h3>
          <p className="text-xs text-zinc-500">Drag on canvas or fine-tune with sliders.</p>
        </div>

        <button
          onClick={onCenter}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
        >
          Center
        </button>
      </div>

      <div className="space-y-4">
        <Slider label="Zoom" value={transform.scale} min={0.2} max={2.5} step={0.01} onChange={(value) => onChange({ scale: value })} />
        <Slider label="Rotate" value={transform.rotation} min={-180} max={180} step={1} onChange={(value) => onChange({ rotation: value })} />
        <Slider label="Brightness" value={transform.brightness} min={-1} max={1} step={0.01} onChange={(value) => onChange({ brightness: value })} />
        <Slider label="Contrast" value={transform.contrast} min={-100} max={100} step={1} onChange={(value) => onChange({ contrast: value })} />
        <Slider label="Saturation" value={transform.saturation} min={0} max={2} step={0.01} onChange={(value) => onChange({ saturation: value })} />

        <div className="rounded-2xl border border-white/8 bg-black/20 p-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">Crop</h4>
              <p className="text-[11px] text-zinc-500">Trim the image edges before export.</p>
            </div>

            <button
              onClick={() => handleCropPreset("reset")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleCropPreset("square")} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-zinc-100 transition hover:bg-white/10">
              Square Crop
            </button>
            <button onClick={() => handleCropPreset("wide")} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-zinc-100 transition hover:bg-white/10">
              Wide Crop
            </button>
            <button onClick={() => handleCropPreset("portrait")} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-zinc-100 transition hover:bg-white/10">
              Portrait Crop
            </button>
            <button onClick={() => onChange({ cropLeft: 0.05, cropTop: 0.05, cropRight: 0.05, cropBottom: 0.05 })} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-zinc-100 transition hover:bg-white/10">
              Center Trim
            </button>
          </div>

          <Slider label="Crop Left" value={transform.cropLeft} min={0} max={0.45} step={0.01} onChange={(value) => onChange({ cropLeft: value })} />
          <Slider label="Crop Top" value={transform.cropTop} min={0} max={0.45} step={0.01} onChange={(value) => onChange({ cropTop: value })} />
          <Slider label="Crop Right" value={transform.cropRight} min={0} max={0.45} step={0.01} onChange={(value) => onChange({ cropRight: value })} />
          <Slider label="Crop Bottom" value={transform.cropBottom} min={0} max={0.45} step={0.01} onChange={(value) => onChange({ cropBottom: value })} />
        </div>
      </div>
    </div>
  );
}
