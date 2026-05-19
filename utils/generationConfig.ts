import { AspectRatio, GenerationOptions } from "@/types/generation";

export function getDimensions(ratio: AspectRatio): { width: number; height: number } {
  switch (ratio) {
    case "portrait":
      return { width: 832, height: 1216 };
    case "landscape":
      return { width: 1216, height: 832 };
    case "square":
    default:
      return { width: 1024, height: 1024 };
  }
}

export function buildInferenceParameters(options: GenerationOptions) {
  const { width, height } = getDimensions(options.aspectRatio);
  
  // Custom HuggingFace API parameters mapping
  const parameters: Record<string, string | number> = {
    width,
    height,
  };

  // We can pass guidance_scale if the endpoint supports it,
  // but we mostly use these values in the prompt enhancement layer.
  if (options.strictness === "strict") {
    parameters.guidance_scale = 1.0;
  } else if (options.strictness === "balanced") {
    parameters.guidance_scale = 3.5;
  } else {
    parameters.guidance_scale = 5.0;
  }

  return parameters;
}
