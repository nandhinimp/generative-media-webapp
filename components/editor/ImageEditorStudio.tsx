"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Konva from "konva";
import CanvasEditor from "./CanvasEditor";
import Toolbar from "./Toolbar";
import TextControls from "./TextControls";
import ImageControls from "./ImageControls";
import { EditorCanvasSize, EditorImageTransform, EditorMode, EditorTextItem } from "@/types/editor";
import { downloadStageAsPng, exportStageAsPngDataUrl } from "@/utils/editorExport";
import { saveEditedImage } from "@/services/generation.service";
import { useAuth } from "@/hooks/useAuth";
import AuthPrompt from "../AuthPrompt";

type Props = {
  imageId: string;
};

const defaultCanvasSize: EditorCanvasSize = {
  width: 1024,
  height: 720,
};

const defaultImageTransform: EditorImageTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  cropLeft: 0,
  cropTop: 0,
  cropRight: 0,
  cropBottom: 0,
  initialized: false,
};

export default function ImageEditorStudio({ imageId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const stageRef = useRef<Konva.Stage | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const imageUrl = searchParams.get("image") || "";
  const prompt = searchParams.get("prompt") || "";

  const [canvasSize, setCanvasSize] = useState(defaultCanvasSize);
  const [selectedMode, setSelectedMode] = useState<EditorMode>("image");
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textItems, setTextItems] = useState<EditorTextItem[]>([]);
  const [imageTransform, setImageTransform] = useState<EditorImageTransform>(defaultImageTransform);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const element = canvasContainerRef.current;
    if (!element) return;

    const resize = () => {
      const bounds = element.getBoundingClientRect();
      setCanvasSize({
        width: Math.max(320, Math.floor(bounds.width)),
        height: Math.max(420, Math.floor(bounds.height)),
      });
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(element);

    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  const selectedText = useMemo(
    () => textItems.find((textItem) => textItem.id === selectedTextId) ?? null,
    [selectedTextId, textItems]
  );

  function handleAddText() {
    const id = globalThis.crypto?.randomUUID?.() ?? `text-${Date.now()}`;
    const newText: EditorTextItem = {
      id,
      text: "Double-click edit style",
      x: Math.max(24, canvasSize.width / 2 - 120),
      y: Math.max(24, canvasSize.height / 2 - 24),
      width: 240,
      fontSize: 36,
      color: "#ffffff",
      fontStyle: "bold",
      rotation: 0,
    };

    setTextItems((current) => [...current, newText]);
    setSelectedMode("text");
    setSelectedTextId(id);
  }

  function handleReset() {
    setTextItems([]);
    setSelectedMode("image");
    setSelectedTextId(null);
    setImageTransform(defaultImageTransform);
  }

  function handleBack() {
    router.back();
  }

  function handleDownload() {
    downloadStageAsPng(stageRef.current, `edited-${imageId}.png`);
  }

  async function handleSave() {
    const dataUrl = exportStageAsPngDataUrl(stageRef.current);
    if (!dataUrl || isSaving) return;

    setIsSaving(true);

    try {
      const savedEdit = await saveEditedImage(Number(imageId), prompt, dataUrl);
      router.push(`/saved-edited-images?highlight=${encodeURIComponent(String(savedEdit.id))}`);
    } catch (error) {
      console.error(error);
      alert("Failed to save edited image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateImageTransform(patch: Partial<EditorImageTransform>) {
    setImageTransform((current) => ({ ...current, ...patch }));
  }

  function updateTextItem(id: string, patch: Partial<EditorTextItem>) {
    setTextItems((current) => current.map((textItem) => (textItem.id === id ? { ...textItem, ...patch } : textItem)));
  }

  function handleSelectMode(mode: EditorMode, textId?: string) {
    setSelectedMode(mode);
    setSelectedTextId(mode === "text" ? textId ?? null : null);
  }

  if (!authLoading && !user) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
        <AuthPrompt
          title="Sign in to edit images"
          description="Editing, saving, and downloading are available after Google sign-in."
        />
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
      <div className="rounded-3xl border border-white/8 bg-white/3 px-5 py-4 glass">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-zinc-100">Lightweight Editor</h1>
              <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">{imageId}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">Edit generated images before you download them.</p>
            {prompt && <p className="mt-2 text-xs text-zinc-500 line-clamp-1">Prompt: {prompt}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/previous-generated-images" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10">
              Library
            </Link>
            <Link href="/saved-edited-images" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10">
              Saved Edits
            </Link>
            <Link href={imageUrl ? `/showcase?image=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}&id=${imageId}` : "/showcase"} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/10">
              Showcase
            </Link>
          </div>
        </div>
      </div>

      <Toolbar onAddText={handleAddText} onDownload={handleDownload} onSave={handleSave} onReset={handleReset} onBack={handleBack} saving={isSaving} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div ref={canvasContainerRef} className="sticky top-4 h-[calc(100vh-11rem)] min-h-[32rem]">
          <CanvasEditor
            imageUrl={imageUrl}
            canvasSize={canvasSize}
            stageRef={stageRef}
            imageTransform={imageTransform}
            selectedMode={selectedMode}
            selectedTextId={selectedTextId}
            textItems={textItems}
            onSelectMode={handleSelectMode}
            onImageChange={updateImageTransform}
            onTextChange={updateTextItem}
          />
        </div>

        <aside className="flex flex-col gap-4 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto lg:pr-1">
          <ImageControls
            transform={imageTransform}
            onChange={updateImageTransform}
            onCenter={() => updateImageTransform({ x: canvasSize.width / 2, y: canvasSize.height / 2 })}
          />

          <TextControls
            text={selectedText}
            onAddText={handleAddText}
            onUpdate={(patch) => {
              if (!selectedTextId) return;
              updateTextItem(selectedTextId, patch);
            }}
            onDelete={() => {
              if (!selectedTextId) return;
              setTextItems((current) => current.filter((textItem) => textItem.id !== selectedTextId));
              setSelectedTextId(null);
              setSelectedMode("image");
            }}
          />
        </aside>
      </div>
    </section>
  );
}
