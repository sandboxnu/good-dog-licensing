import { NextResponse } from "next/server";
import { MatchState, prisma } from "@good-dog/db";

const AUTO_APPROVE_DAYS = 7;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - AUTO_APPROVE_DAYS);

  const result = await prisma.match.updateMany({
    where: {
      matchState: MatchState.SENT_TO_MUSICIAN,
      createdAt: {
        lte: cutoffDate,
      },
    },
    data: {
      matchState: MatchState.APPROVED_BY_MUSICIAN,
    },
  });

  return NextResponse.json({ success: true, updatedCount: result.count });
}
