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
        <span className="cursor-pointer border-b border-dotted border-green-300 hover:bg-muted transition-colors">
          {word}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold text-body2">{word}</h4>
          <p className="text-body2 text-muted-foreground">{definition}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
