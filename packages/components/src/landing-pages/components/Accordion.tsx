import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Accordion({
  id,
  title,
  body,
}: {
  id: string;
  title: string;
  body: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail !== id) setOpen(false);
    };
    window.addEventListener("close-accordions", handler as EventListener);
    return () =>
      window.removeEventListener("close-accordions", handler as EventListener);
  }, [id]);

  const handleClick = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      window.dispatchEvent(new CustomEvent("close-accordions", { detail: id }));
    }
  };

  return (
    <div className="border border-[#ECE6DF] dark:border-[#454545] bg-cream-100 dark:bg-green-600 shadow-[0_2px_6px_0_#ECE6DF] dark:shadow-[0_2px_6px_0_#454545] w-full rounded-[24px] p-[24px] flex flex-col gap-[8px]">
      <div className="flex flex-row justify-between">
        <p className="text-[20px] font-semibold text-green-400 dark:text-mint-200">
          {title}
        </p>
        <ChevronUp
          className={`transition-all text-green-500 dark:text-mint-200 ${!open ? "rotate-180" : ""}`}
          onClick={handleClick}
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
