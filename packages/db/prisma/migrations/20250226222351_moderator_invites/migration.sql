-- CreateTable
CREATE TABLE "ModeratorInvite" (
    "moderatorInviteId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModeratorInvite_pkey" PRIMARY KEY ("moderatorInviteId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModeratorInvite_email_key" ON "ModeratorInvite"("email");
