import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGenerations as getDevGenerations } from "@/lib/devStore";

export async function GET() {
  try {
    const generations = await prisma.$queryRaw<
      Array<{
        id: number;
        prompt: string;
        imageUrl: string;
        createdAt: Date;
      }>
    >`
      SELECT "id", "prompt", "imageUrl", "createdAt"
      FROM "Generation"
      WHERE "deletedAt" IS NULL
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json(
      generations.map((generation) => ({
        ...generation,
        createdAt: generation.createdAt.toISOString(),
      }))
    );

  } catch (error) {
    console.error(error);

    const fallbackGenerations = getDevGenerations();
    return NextResponse.json(fallbackGenerations);

  }
}