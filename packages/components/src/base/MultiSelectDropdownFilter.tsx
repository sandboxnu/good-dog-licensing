import { CheckIcon, ChevronDown } from "lucide-react";

import { Button as ButtonShad } from "@good-dog/ui/button";
import { cn } from "@good-dog/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@good-dog/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@good-dog/ui/popover";
import { useState } from "react";

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <ButtonShad
          variant="outlined"
          size="small-text-with-icon"
          className={`border border-cream-400 dark:border-cream-600 bg-cream-100 dark:bg-green-700 group 
            ${isOpen ? "!border-green-300 !dark:border-grass-green-100" : ""}
            hover:bg-mint-200 dark:hover:bg-green-500 active:bg-mint-300 dark:active:bg-green-600`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="text-green-500 dark:text-mint-100">{label}</p>
            <ChevronDown className="h-4 w-4 transition-transform text-green-500 dark:text-mint-100" />
          </div>
        </ButtonShad>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border border-green-300 dark:border-grass-green-100 bg-gray-100 dark:bg-dark-gray-500 p-2"
        align="start"
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <Command shouldFilter={false}>
          {searchBar && (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full mb-2 px-2 py-1 text-sm rounded border border-cream-400 dark:border-cream-600 bg-white dark:bg-dark-gray-600 outline-none focus:border-green-300"
            />
          )}
          <CommandList className="max-h-[380px] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>
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
                      className="cursor-pointer rounded-lg flex items-center gap-2 px-2 py-1.5"
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
