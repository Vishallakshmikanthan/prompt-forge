/*
  Warnings:

  - You are about to drop the column `safetyStatus` on the `Prompt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "safetyStatus",
ADD COLUMN     "embedding" DOUBLE PRECISION[],
ADD COLUMN     "moderationStatus" TEXT NOT NULL DEFAULT 'approved',
ADD COLUMN     "parentPromptId" TEXT,
ADD COLUMN     "qualityScore" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "website" TEXT;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_parentPromptId_fkey" FOREIGN KEY ("parentPromptId") REFERENCES "Prompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
