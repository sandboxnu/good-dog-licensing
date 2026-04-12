import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

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
      <TabsList className="flex h-auto flex-row rounded-full bg-green-400">
        <TabsTrigger
          value="incoming"
          className="box-content flex w-full flex-row gap-1 rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black lg:flex-1"
        >
          Suggestions
          {numActionRequired > 0 && (
            <NotificationBadge number={numActionRequired} />
          )}
        </TabsTrigger>

        <TabsTrigger
          value="pendingApproval"
          className="box-content flex w-full flex-row gap-1 rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black lg:flex-1"
        >
          In progress
        </TabsTrigger>

        <TabsTrigger
          value="matched"
          className="box-content w-full rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black lg:flex-1"
        >
          Matched
        </TabsTrigger>

        <TabsTrigger
          value="rejected"
          className="box-content w-full rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black lg:flex-1"
        >
          Rejected
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incoming">{suggestions}</TabsContent>
      <TabsContent value="pendingApproval">{inProgress}</TabsContent>
      <TabsContent value="matched">{matched}</TabsContent>
      <TabsContent value="rejected">{rejected}</TabsContent>
    </Tabs>
  );
}
