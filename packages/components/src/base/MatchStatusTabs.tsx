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
  size = "default",
}: {
  tabs: MatchStatusTab[];
  defaultValue?: string;
  /** "large" uses bigger tab labels, e.g. for top-level page sections. */
  size?: "default" | "large";
}) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value}>
      <TabsList
        className={`flex h-auto flex-row rounded-full bg-green-400 max-md:flex-wrap max-md:gap-1 max-md:rounded-2xl max-md:p-1 dark:bg-green-300 ${
          // Large tabs size to their labels instead of spanning the page
          size === "large" ? "w-fit max-md:w-full" : ""
        }`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`box-content flex w-full flex-row gap-1 rounded-full px-4 py-3 text-white data-[state=active]:bg-white data-[state=active]:text-black max-md:box-border max-md:w-auto max-md:min-w-[40%] max-md:flex-1 max-md:px-3 max-md:py-2 lg:flex-1 ${size === "large" ? "w-auto! px-8! py-3! text-lg! font-medium max-md:min-w-0! max-md:px-3! max-md:text-base! max-md:whitespace-normal! md:text-2xl! lg:flex-none!" : ""}`}
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
