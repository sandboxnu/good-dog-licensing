import { useState } from "react";
import { CheckIcon, ChevronDown, X } from "lucide-react";

import { cn } from "@good-dog/ui";
import { Button as ButtonShad } from "@good-dog/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@good-dog/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@good-dog/ui/popover";

interface MultiselectDropdownFilterProps {
  label: string;
  value: string[];
  options: {
    label: string;
    value: string;
  }[];
  onChange: (newValue: string[]) => void;
  searchBar?: boolean;
  columns?: number;
}

export default function MultiselectDropdownFilter({
  label,
  value,
  options,
  onChange,
  searchBar = false,
  columns = 2,
}: MultiselectDropdownFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleOption = (option: string) => {
    const next = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(next);
  };

  const filteredOptions = searchBar
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <PopoverTrigger asChild>
        <ButtonShad
          variant="outlined"
          size="small-text-with-icon"
          className={`group border border-cream-400 bg-cream-100 dark:border-cream-600 dark:bg-green-700 ${isOpen ? "!dark:border-grass-green-100 !border-green-300" : ""} hover:bg-mint-200 active:bg-mint-300 dark:hover:bg-green-500 dark:active:bg-green-600`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="text-green-500 dark:text-mint-100">{label}</p>
            <ChevronDown className="h-4 w-4 text-green-500 transition-transform dark:text-mint-100" />
          </div>
        </ButtonShad>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border border-green-300 bg-gray-100 p-2 dark:border-grass-green-100 dark:bg-dark-gray-500"
        align="start"
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <Command shouldFilter={false}>
          {searchBar && (
            <div className="mb-2 flex w-full items-center gap-2 rounded-lg border border-[0.5px] border-dark-gray-100 bg-white px-2 py-1 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-400 dark:border-dark-gray-300 dark:bg-dark-gray-500">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm text-dark-gray-500 outline-none placeholder:text-dark-gray-100 dark:text-gray-300 dark:placeholder:text-dark-gray-300"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-dark-gray-300 hover:text-dark-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          <CommandList
            className="max-h-[380px] overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <CommandEmpty className="items-center justify-center text-base text-dark-gray-500 dark:text-gray-300">
              No results found.
            </CommandEmpty>
            <CommandGroup>
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5"
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border border-green-400 dark:border-green-100",
                          isSelected
                            ? "bg-green-400 dark:bg-mint-300"
                            : "bg-transparent",
                        )}
                      >
                        {isSelected && (
                          <CheckIcon className="h-3 w-3 text-gray-100 dark:text-green-600" />
                        )}
                      </div>
                      <span className="text-base text-dark-gray-500 dark:text-gray-300">
                        {option.label}
                      </span>
                    </CommandItem>
                  );
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
