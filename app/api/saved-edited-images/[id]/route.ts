import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteSavedEdit as deleteDevSavedEdit } from "@/lib/devStore";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    try {
      await prisma.$executeRaw`
        UPDATE "SavedEdit"
        SET "deletedAt" = NOW()
        WHERE "id" = ${id}
      `;
    } catch (dbError) {
      const removed = deleteDevSavedEdit(id);
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