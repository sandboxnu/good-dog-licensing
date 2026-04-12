import { Popover, PopoverContent, PopoverTrigger } from "@good-dog/ui/popover";

interface FootnoteProps {
  number: number;
  tooltip: string;
}

export default function Footnote({ number, tooltip }: FootnoteProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <sup className="font-afacad cursor-pointer font-medium not-italic leading-[128%] text-green-400 dark:text-mint-200">
          [<span className="underline underline-offset-[4px]">{number}</span>]
        </sup>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        collisionPadding={16}
        side="top"
        sideOffset={8}
        className="w-[min(400px,calc(100vw-2rem))] rounded-[8px] border-cream-500 bg-gray-100 p-[16px] text-[14px] leading-[1.05] dark:border-cream-600 dark:bg-dark-gray-600 dark:shadow-card-dark md:text-[16px]"
      >
        <span className="block font-normal leading-[1.05] text-gray-500 dark:text-gray-300">
          {tooltip}
        </span>
      </PopoverContent>
    </Popover>
  );
}
