export type EditorMode = "image" | "text" | null;

export type EditorImageTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  cropLeft: number;
  cropTop: number;
  cropRight: number;
  cropBottom: number;
  initialized?: boolean;
};

export type EditorTextItem = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  color: string;
  fontStyle: "normal" | "bold" | "italic" | "bold italic";
  rotation: number;
};

export type EditorCanvasSize = {
  width: number;
  height: number;
};
