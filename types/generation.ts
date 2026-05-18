export type AspectRatio = "square" | "portrait" | "landscape";

export type StylePreset = "none" | "realistic" | "anime" | "cinematic" | "fantasy" | "fashion_editorial" | "minimal" | "3d_illustration";

export type CreativityLevel = "accurate" | "balanced" | "creative";

export type PromptStrictness = "strict" | "balanced" | "flexible";

export interface GenerationOptions {
  aspectRatio: AspectRatio;
  stylePreset: StylePreset;
  creativity: CreativityLevel;
  strictness: PromptStrictness;
}

export type Generation = {
  id: number;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  deletedAt?: string | null;
  saved?: boolean;
  warning?: string;
};
