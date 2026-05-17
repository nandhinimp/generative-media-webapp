import { NextResponse } from "next/server";
import { generateImage } from "@/lib/huggingface";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const imageUrl = await generateImage(prompt);

    try {
      const generation = await prisma.generation.create({
        data: {
          prompt,
          imageUrl,
        },
      });

      return NextResponse.json({
        ...generation,
        saved: true,
      });
    } catch (dbError) {
      console.error("Failed to save generation:", dbError);

      return NextResponse.json({
        id: null,
        prompt,
        imageUrl,
        createdAt: new Date().toISOString(),
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
