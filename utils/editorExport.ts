import Konva from "konva";

export function exportStageAsPngDataUrl(stage: Konva.Stage | null) {
  if (!stage) return null;

  return stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
}

export function downloadStageAsPng(stage: Konva.Stage | null, filename = "edited-image.png") {
  const dataUrl = exportStageAsPngDataUrl(stage);
  if (!dataUrl) return;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
