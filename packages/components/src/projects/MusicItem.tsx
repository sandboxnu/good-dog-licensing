"use client";

import { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";

import { cn } from "@good-dog/ui";
import { Button } from "@good-dog/ui/button";
import { Card } from "@good-dog/ui/card";
import { ScrollArea } from "@good-dog/ui/scroll-area";

interface MusicItemProps {
  title: string;
  artist: string;
}

export function MusicItem({ title, artist }: MusicItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <Card className="bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{`"${title}" by ${artist}`}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-500 hover:bg-green-50 hover:text-green-600"
            >
              <ArrowUpIcon className="h-5 w-5" />
              <span className="sr-only">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <ArrowDownIcon className="h-5 w-5" />
              <span className="sr-only">Dislike</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDownIcon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isExpanded ? "rotate-180 transform" : "",
                )}
              />
              <span className="sr-only">Show details</span>
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Song Details</h4>
                  <p className="text-sm text-gray-600">
                    Released in 2018 as part of the Black Panther soundtrack,
                    "All the Stars" is a collaboration between Kendrick Lamar
                    and SZA. The song was nominated for several Grammy Awards
                    and an Academy Award.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Licensing Information</h4>
                  <p className="text-sm text-gray-600">
                    This track requires proper licensing for commercial use.
                    Standard licensing fees apply based on distribution scope
                    and usage context.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Usage Rights</h4>
                  <p className="text-sm text-gray-600">
                    When licensed, this track can be used in your scene with
                    proper attribution. Modifications to the original track may
                    require additional permissions.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Similar Tracks</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    <li>Pray For Me - The Weeknd, Kendrick Lamar</li>
                    <li>King's Dead - Jay Rock, Kendrick Lamar</li>
                    <li>The Ways - Khalid, Swae Lee</li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </Card>
    </div>
  );
}
