import type { ReactNode } from "react";
import { Check, FileText, X } from "lucide-react";
import { useState } from "react";

import { ConfirmationModal } from "../matching/ConfirmationModal";

interface DialogConfig {
  title: string;
  text: string;
  showCheckbox?: boolean;
  link?: string;
}

export interface MatchCardProps {
  title: ReactNode;
  subtitle: ReactNode;
  actionable: boolean;
  showActions: boolean;
  contract: { contractId: string } | null;
  selected?: boolean;
  onClick: () => void;
  onApprove: () => void;
  onReject: () => void;
  approveDialog: DialogConfig;
  rejectDialog: DialogConfig;
}

export function MatchCard({
  title,
  subtitle,
  actionable,
  showActions,
  contract,
  selected,
  onClick,
  onApprove,
  onReject,
  approveDialog,
  rejectDialog,
}: MatchCardProps) {
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const handleCheck: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setOpenApprove(true);
  };

  const handleX: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setOpenReject(true);
  };

  const handleContract: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    if (contract) {
      window.open("/contract/" + contract.contractId, "_blank");
    }
  };

  const handleApprove = () => {
    onApprove();
    setOpenApprove(false);
  };

  const handleReject = () => {
    onReject();
    setOpenReject(false);
  };

  const borderClass = selected
    ? "border-green-300 hover:border-green-400 dark:border-green-400 dark:hover:border-green-300"
    : "border-cream-500 hover:border-light-gray";

  const bgClass = actionable
    ? "bg-cream-100 dark:bg-dark-gray-600"
    : "bg-gray-200 dark:bg-green-500";

  return (
    <div
      className={`flex w-full cursor-pointer flex-row items-center justify-between rounded-2xl border-[1px] px-6 py-4 shadow-md ${borderClass} ${bgClass}`}
      onClick={onClick}
    >
      <div className="flex min-w-0 flex-1 flex-row items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="truncate text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
            {title}
          </p>
          <p className="truncate text-dark-gray-200 dark:text-dark-gray-200">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {contract && (
          <FileText className="dark:text-gray-200" onClick={handleContract} />
        )}
        {showActions && (
          <>
            <button type="button" onClick={handleCheck}>
              <Check className="hover:text-green-300 hover:bg-green-100 rounded-md dark:text-gray-200 dark:hover:bg-green-300" />
            </button>
            <button type="button" onClick={handleX}>
              <X className="hover:text-required-star hover:bg-required-star/25 rounded-md dark:text-gray-200 dark:hover:bg-required-star/75" />
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <ConfirmationModal
                open={openApprove}
                onOpenChange={setOpenApprove}
                onAction={handleApprove}
                type="approve"
                {...approveDialog}
              />
              <ConfirmationModal
                open={openReject}
                onOpenChange={setOpenReject}
                onAction={handleReject}
                type="deny"
                {...rejectDialog}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
