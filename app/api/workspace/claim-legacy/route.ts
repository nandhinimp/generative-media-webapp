import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirebaseRequestUser } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const user = await getFirebaseRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const generationResult = await prisma.$executeRaw`
      UPDATE "Generation"
      SET "userId" = ${user.uid},
          "userName" = COALESCE("userName", ${user.name}),
          "userImage" = COALESCE("userImage", ${user.image})
      WHERE "userId" = 'legacy-user'
    `;

    const savedEditResult = await prisma.$executeRaw`
      UPDATE "SavedEdit"
      SET "userId" = ${user.uid},
          "userName" = COALESCE("userName", ${user.name}),
          "userImage" = COALESCE("userImage", ${user.image})
      WHERE "userId" = 'legacy-user'
    `;

    return NextResponse.json({
      ok: true,
      generationUpdates: generationResult,
      savedEditUpdates: savedEditResult,
    });
  } catch (error) {
    console.error("Claim legacy workspace error", error);
    return NextResponse.json({ error: "Failed to claim legacy workspace" }, { status: 500 });
  }
}