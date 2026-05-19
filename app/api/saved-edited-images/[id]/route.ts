import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteSavedEdit as deleteDevSavedEdit } from "@/lib/devStore";
import { getFirebaseRequestUser } from "@/lib/firebaseAdmin";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getFirebaseRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    try {
      await prisma.$executeRaw`
        UPDATE "SavedEdit"
        SET "deletedAt" = NOW()
        WHERE "id" = ${id}
          AND "userId" = ${user.uid}
      `;
    } catch (dbError) {
      const removed = deleteDevSavedEdit(id, user.uid);
      if (!removed) {
        throw dbError;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete saved edit error", error);
    return NextResponse.json({ error: "Failed to delete saved edit" }, { status: 500 });
  }
}