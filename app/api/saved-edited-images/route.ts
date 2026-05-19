import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSavedEdit as createDevSavedEdit, getSavedEdits as getDevSavedEdits } from "@/lib/devStore";
import { getFirebaseRequestUser } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  const user = await getFirebaseRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const savedEdits = await prisma.$queryRaw<
      Array<{
        id: number;
        sourceGenerationId: number;
        prompt: string;
        imageUrl: string;
        createdAt: Date;
        userId: string | null;
        userName: string | null;
        userImage: string | null;
      }>
    >`
      SELECT "id", "sourceGenerationId", "prompt", "imageUrl", "createdAt", "userId", "userName", "userImage"
      FROM "SavedEdit"
      WHERE "deletedAt" IS NULL
        AND "userId" = ${user.uid}
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json(
      savedEdits.map((savedEdit) => ({
        ...savedEdit,
        createdAt: savedEdit.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(getDevSavedEdits(user.uid));
  }
}

export async function POST(req: Request) {
  const user = await getFirebaseRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const sourceGenerationId = Number(body?.sourceGenerationId);
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";

    if (Number.isNaN(sourceGenerationId) || !prompt || !imageUrl) {
      return NextResponse.json({ error: "sourceGenerationId, prompt, and imageUrl are required" }, { status: 400 });
    }

    try {
      const rows = await prisma.$queryRaw<
        Array<{
          id: number;
          sourceGenerationId: number;
          prompt: string;
          imageUrl: string;
          createdAt: Date;
          userId: string | null;
          userName: string | null;
          userImage: string | null;
        }>
      >`
        INSERT INTO "SavedEdit" ("sourceGenerationId", "prompt", "imageUrl", "userId", "userName", "userImage")
        VALUES (${sourceGenerationId}, ${prompt}, ${imageUrl}, ${user.uid}, ${user.name}, ${user.image})
        RETURNING "id", "sourceGenerationId", "prompt", "imageUrl", "createdAt", "userId", "userName", "userImage"
      `;

      const savedEdit = rows[0];
      return NextResponse.json({
        ...savedEdit,
        createdAt: savedEdit.createdAt.toISOString(),
      });
    } catch (dbError) {
      console.error("Failed to save edited image:", dbError);
      const savedEdit = createDevSavedEdit(sourceGenerationId, prompt, imageUrl, user);
      return NextResponse.json(savedEdit);
    }
  } catch (error) {
    console.error("Save edited image error", error);
    return NextResponse.json({ error: "Failed to save edited image" }, { status: 500 });
  }
}