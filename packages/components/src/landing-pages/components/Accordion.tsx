import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

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
    <div className="flex w-full flex-col gap-[8px] rounded-[24px] border border-[#ECE6DF] bg-cream-100 p-[24px] shadow-[0_2px_6px_0_#ECE6DF] dark:border-[#454545] dark:bg-green-600 dark:shadow-[0_2px_6px_0_#454545]">
      <div className="flex flex-row justify-between">
        <p className="text-[20px] font-semibold text-green-400 dark:text-mint-200">
          {title}
        </p>
        <ChevronUp
          className={`text-green-500 transition-all dark:text-mint-200 ${!open ? "rotate-180" : ""}`}
          onClick={handleClick}
        />
      </div>
      {open && (
        <p className="text-dark-grey-500 text-left text-[18px] font-medium dark:text-gray-300">
          {body}
        </p>
      )}
    </div>
  );
}
