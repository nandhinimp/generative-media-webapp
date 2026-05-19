import { NextResponse } from "next/server";
import { generateImage } from "@/lib/huggingface";
import { prisma } from "@/lib/prisma";
import { enhancePrompt, defaultNegativePrompt } from "@/utils/enhancePrompt";
import { GenerationOptions } from "@/types/generation";
import { createGeneration as createDevGeneration } from "@/lib/devStore";
import { getFirebaseRequestUser } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const user = await getFirebaseRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();

    const { prompt, options } = body as { prompt: string; options?: GenerationOptions };

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const enhancedPrompt = enhancePrompt(prompt, options);
    const imageUrl = await generateImage(enhancedPrompt, defaultNegativePrompt, options);

    try {
      const generation = await prisma.generation.create({
        data: {
          prompt,
          imageUrl,
          userId: user.uid,
          userName: user.name,
          userImage: user.image,
        },
      });

      return NextResponse.json({
        ...generation,
        saved: true,
      });
    } catch (dbError) {
      console.error("Failed to save generation:", dbError);
      const generation = createDevGeneration(prompt, imageUrl, user);

      return NextResponse.json({
        ...generation,
        saved: false,
        warning: "Image generated, but it could not be saved to the database.",
      });
    }

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
