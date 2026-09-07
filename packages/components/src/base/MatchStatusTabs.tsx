import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@good-dog/ui/tabs";

import { NotificationBadge } from "./NotificationBadge";

export interface MatchStatusTab {
  value: string;
  label: string;
  content: ReactNode;
  badgeCount?: number;
}

export function MatchStatusTabs({
  tabs,
  defaultValue,
}: {
  tabs: MatchStatusTab[];
  defaultValue?: string;
}) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value}>
      <TabsList className="flex h-auto flex-row rounded-full bg-green-400 dark:bg-green-300">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="box-content flex w-full flex-row gap-1 rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black lg:flex-1"
          >
            {tab.label}
            {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
              <NotificationBadge number={tab.badgeCount} />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
