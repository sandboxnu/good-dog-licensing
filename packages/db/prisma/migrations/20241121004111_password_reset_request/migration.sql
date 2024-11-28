-- CreateTable
CREATE TABLE "PasswordResetReq" (
    "passwordResetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetReq_pkey" PRIMARY KEY ("passwordResetId")
);

-- AddForeignKey
ALTER TABLE "PasswordResetReq" ADD CONSTRAINT "PasswordResetReq_passwordResetId_fkey" FOREIGN KEY ("passwordResetId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
