import React from "react";

import CloseX from "../svg/CloseX";
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
        className={`rounded-[16px] border border-dark-gray-500 bg-gray-100 dark:bg-dark-gray-600 shadow-modal`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div className="flex justify-end px-[21px] pt-[24px]">
          <button onClick={onClose}>
            <CloseX />
          </button>
        </div>
        {danger && (
          <div className="flex items-center justify-center">
            <ErrorExclamation size="large" />
          </div>
        )}
        <div className={`${upperPadding ? "pt-[18px]" : ""} text-center`}>
          <h3>{headerText}</h3>
        </div>
        <div className="flex flex-col items-center text-center">{children}</div>
      </div>
    </div>
  );
}
