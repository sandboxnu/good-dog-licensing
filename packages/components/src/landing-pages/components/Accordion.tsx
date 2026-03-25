import { ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";

export default function Accordion({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="bg-white dark:bg-green-600 w-full rounded-[24px] p-[24px] flex flex-col gap-[8px]">
      <div className="flex flex-row justify-between">
        <p className="text-[20px] font-semibold text-green-400 dark:text-mint-200">
          {title}
        </p>
        <ChevronUp
          className={`transition-all text-green-500 dark:text-mint-200 ${!open ? "rotate-180" : ""}`}
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
        <p className="text-left text-[18px] font-medium text-dark-grey-500 dark:text-gray-300">
          {body}
        </p>
      )}
    </div>
  );
}
