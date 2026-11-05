import React from "react";
import { X } from "lucide-react";

import ErrorExclamation from "../svg/status-icons/ErrorExclamation";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  headerText: string;
  height: number;
  width: number;
  upperPadding?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  headerText,
  height,
  width,
  upperPadding = true,
  danger,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center`}>
      <div
        // On phones, cap the width to the screen and let the height grow to fit
        // wrapped content. Desktop keeps the fixed width and height.
        className={`h-(--modal-height) max-w-[calc(100vw-32px)] rounded-[16px] border border-dark-gray-500 bg-gray-100 shadow-modal max-md:h-auto max-md:min-h-(--modal-height) max-md:pb-[24px] dark:bg-dark-gray-600`}
        style={
          {
            width: `${width}px`,
            "--modal-height": `${height}px`,
          } as React.CSSProperties
        }
      >
        <div className="flex justify-end px-[21px] pt-[24px]">
          <button onClick={onClose}>
            <X className="text-dark-gray-500 dark:text-gray-200" />
          </button>
        </div>
        {danger && (
          <div className="flex items-center justify-center text-red-400">
            <ErrorExclamation size="large" />
          </div>
        )}
        <div
          className={`${upperPadding ? "pt-[18px]" : ""} text-center text-dark-gray-500 dark:text-mint-300`}
        >
          <h3 className="text-dark-gray-500 dark:text-gray-200">
            {headerText}
          </h3>
        </div>
        <div className="flex flex-col items-center text-center max-md:px-[16px]">
          {children}
        </div>
      </div>
    </div>
  );
}
