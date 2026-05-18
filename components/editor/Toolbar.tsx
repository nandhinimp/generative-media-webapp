"use client";

type Props = {
  onAddText: () => void;
  onDownload: () => void;
  onSave: () => void;
  onReset: () => void;
  onBack: () => void;
  saving?: boolean;
};

export default function Toolbar({ onAddText, onDownload, onSave, onReset, onBack, saving }: Props) {
  const buttonClass =
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-white/8 bg-black/40 p-3 shadow-xl backdrop-blur-md">
      <button onClick={onBack} className={buttonClass}>
        <span>Back</span>
      </button>

      <button onClick={onAddText} className={buttonClass}>
        <span>Add Text</span>
      </button>

      <button onClick={onReset} className={buttonClass}>
        <span>Reset</span>
      </button>

      <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-50 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60">
        <span>{saving ? "Saving..." : "Save Changes"}</span>
      </button>

      <button onClick={onDownload} className="ml-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/10 transition hover:opacity-95">
        <span>Download PNG</span>
      </button>
    </div>
  );
}
