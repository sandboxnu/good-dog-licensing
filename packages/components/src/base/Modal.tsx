import React from "react";
import CloseX from "../svg/CloseX";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  headerText: string;
  height: number;
  width: number;
  upperPadding?: boolean;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  headerText,
  height,
  width,
  upperPadding = true,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className={`absolute inset-0 flex items-center justify-center z-50`}>
      <div
        className={`bg-white rounded-[16px] border border-body-primary shadow-modal`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div className="pt-[24px] px-[21px] flex justify-end">
          <button onClick={onClose}>
            <CloseX />
          </button>
        </div>
        <div className={`${upperPadding ? "pt-[18px]" : ""} text-center`}>
          <h3>{headerText}</h3>
        </div>
        <div className="flex flex-col items-center text-center">{children}</div>
      </div>
    </div>
  );
}
