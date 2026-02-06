import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";
import type { ReactNode } from "react";
import { NotificationBadge } from "../../base/NotificationBadge";

export function MatchStatusTabs({
  numActionRequired,
  suggestions,
  inProgress,
  matched,
  rejected,
}: {
  numActionRequired: number;
  suggestions: ReactNode;
  inProgress: ReactNode;
  matched: ReactNode;
  rejected: ReactNode;
}) {
  return (
    <Tabs defaultValue="incoming">
      <TabsList className="rounded-full bg-good-dog-main h-auto">
        <TabsTrigger
          value="incoming"
          className="flex flex-row gap-1 rounded-full text-white data-[state=active]:bg-white w-[182px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          Suggestions
          {numActionRequired > 0 && (
            <NotificationBadge number={numActionRequired} />
          )}
        </TabsTrigger>

        <TabsTrigger
          value="pendingApproval"
          className="flex flex-row gap-1 rounded-full text-white data-[state=active]:bg-white w-[182px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          In progress
        </TabsTrigger>

        <TabsTrigger
          value="matched"
          className="rounded-full text-white data-[state=active]:bg-white w-[182px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          Matched
        </TabsTrigger>

        <TabsTrigger
          value="rejected"
          className="rounded-full text-white data-[state=active]:bg-white w-[182px] data-[state=active]:text-black px-4 py-3 box-content"
        >
          Rejected
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incoming">{suggestions}</TabsContent>
      <TabsContent value="pendingApproval">
        {inProgress}
      </TabsContent>
      <TabsContent value="matched">{matched}</TabsContent>
      <TabsContent value="rejected">{rejected}</TabsContent>
    </Tabs>
  );
}
