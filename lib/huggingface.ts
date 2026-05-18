import { InferenceClient } from "@huggingface/inference";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { GenerationOptions } from "@/types/generation";
import { buildInferenceParameters } from "@/utils/generationConfig";

const client = new InferenceClient(process.env.HF_TOKEN);

export async function generateImage(prompt: string, negativePrompt?: string, options?: GenerationOptions) {
  if (!process.env.HF_TOKEN) {
    throw new Error("HF_TOKEN is not configured in .env");
  }

  const parameters: Record<string, any> = {};
  if (negativePrompt) {
    parameters.negative_prompt = negativePrompt;
  }
  if (options) {
    Object.assign(parameters, buildInferenceParameters(options));
  }

  const image = await client.textToImage(
    {
      provider: "auto",
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
      parameters: Object.keys(parameters).length > 0 ? parameters : undefined,
    },
    {
      outputType: "blob",
    }
  );

  const generatedDir = path.join(process.cwd(), "public", "generated");
  await mkdir(generatedDir, { recursive: true });

  const fileName = `${randomUUID()}.png`;
  const filePath = path.join(generatedDir, fileName);
  const arrayBuffer = await image.arrayBuffer();

  await writeFile(filePath, Buffer.from(arrayBuffer));

  return `/generated/${fileName}`;
}
