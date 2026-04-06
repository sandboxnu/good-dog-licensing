import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

import { NotificationBadge } from "../../base/NotificationBadge";

export function MatchStatusTabs({
  numActionRequired,
  incomingContent,
  matchedContent,
  rejectedContent,
}: {
  numActionRequired: number;
  incomingContent: ReactNode;
  matchedContent: ReactNode;
  rejectedContent: ReactNode;
}) {
  return (
    <Tabs defaultValue="incoming">
      <TabsList className="h-auto rounded-full bg-green-400 dark:bg-green-300">
        <TabsTrigger
          value="incoming"
          className="box-content flex w-[224px] flex-row gap-1 rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black"
        >
          Incoming matches
          {numActionRequired > 0 && (
            <NotificationBadge number={numActionRequired} />
          )}
        </TabsTrigger>

        <TabsTrigger
          value="matched"
          className="box-content w-[224px] rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black"
        >
          Matched
        </TabsTrigger>

        <TabsTrigger
          value="rejected"
          className="box-content w-[224px] rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black"
        >
          Rejected
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incoming">{incomingContent}</TabsContent>
      <TabsContent value="matched">{matchedContent}</TabsContent>
      <TabsContent value="rejected">{rejectedContent}</TabsContent>
    </Tabs>
  );
}
