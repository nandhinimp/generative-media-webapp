import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const generations = await prisma.generation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(generations);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch generations" },
      { status: 500 }
    );
  }
}