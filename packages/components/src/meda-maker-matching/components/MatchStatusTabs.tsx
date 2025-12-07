import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";
import type { ReactNode } from "react";
import { NotificationBadge } from "../../base/NotificationBadge";

export function MatchStatusTabs({
  numActionRequired,
  incomingContent,
  pendingApprovalContent,
  matchedContent,
  rejectedContent,
}: {
  numActionRequired: number;
  incomingContent: ReactNode;
  pendingApprovalContent: ReactNode;
  matchedContent: ReactNode;
  rejectedContent: ReactNode;
}) {
  return (
    <Tabs defaultValue="incoming">
      <TabsList className="rounded-full bg-good-dog-main h-auto">
        <TabsTrigger
          value="incoming"
          className="flex flex-row gap-1 rounded-full text-white data-[state=active]:bg-white w-[224px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          Incoming matches
          {numActionRequired > 0 && (
            <NotificationBadge number={numActionRequired} />
          )}
        </TabsTrigger>

        <TabsTrigger
          value="pendingApproval"
          className="flex flex-row gap-1 rounded-full text-white data-[state=active]:bg-white w-[224px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          Pending approval
        </TabsTrigger>

        <TabsTrigger
          value="matched"
          className="rounded-full text-white data-[state=active]:bg-white w-[224px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          Matched
        </TabsTrigger>

        <TabsTrigger
          value="rejected"
          className="rounded-full text-white data-[state=active]:bg-white w-[224px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          Rejected
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incoming">{incomingContent}</TabsContent>
      <TabsContent value="pendingApproval">
        {pendingApprovalContent}
      </TabsContent>
      <TabsContent value="matched">{matchedContent}</TabsContent>
      <TabsContent value="rejected">{rejectedContent}</TabsContent>
    </Tabs>
  );
}
