CREATE TABLE "SavedEdit" (
    "id" SERIAL NOT NULL,
    "sourceGenerationId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SavedEdit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SavedEdit_createdAt_idx" ON "SavedEdit"("createdAt" DESC);
CREATE INDEX "SavedEdit_sourceGenerationId_idx" ON "SavedEdit"("sourceGenerationId");