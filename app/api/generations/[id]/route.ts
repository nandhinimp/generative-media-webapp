import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteGeneration as deleteDevGeneration } from "@/lib/devStore";
import { getFirebaseRequestUser } from "@/lib/firebaseAdmin";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getFirebaseRequestUser(_req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    try {
      await prisma.$executeRaw`
        UPDATE "Generation"
        SET "deletedAt" = NOW()
        WHERE "id" = ${id}
          AND "userId" = ${user.uid}
      `;
    } catch (dbError) {
      const removed = deleteDevGeneration(id, user.uid);
      if (!removed) {
        throw dbError;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete generation error', error);
    return NextResponse.json({ error: 'Failed to delete generation' }, { status: 500 });
  }
}
