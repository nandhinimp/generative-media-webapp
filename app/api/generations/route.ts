import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGenerations as getDevGenerations } from "@/lib/devStore";
import { getFirebaseRequestUser } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  const user = await getFirebaseRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const generations = await prisma.$queryRaw<
      Array<{
        id: number;
        prompt: string;
        imageUrl: string;
        createdAt: Date;
        userId: string | null;
        userName: string | null;
        userImage: string | null;
      }>
    >`
      SELECT "id", "prompt", "imageUrl", "createdAt", "userId", "userName", "userImage"
      FROM "Generation"
      WHERE "deletedAt" IS NULL
        AND "userId" = ${user.uid}
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

    const fallbackGenerations = getDevGenerations(user.uid);
    return NextResponse.json(fallbackGenerations);

  }
}