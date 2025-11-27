"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@good-dog/ui/popover";

interface DictionaryWordProps {
  word: string;
  definition: string;
}

export function DictionaryWord({ word, definition }: DictionaryWordProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="hover:bg-muted cursor-pointer border-b border-dotted border-green-300 transition-colors">
          {word}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-body2 font-semibold">{word}</h4>
          <p className="text-muted-foreground text-body2">{definition}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
