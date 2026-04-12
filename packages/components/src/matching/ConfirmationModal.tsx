import { useState } from "react";

import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@good-dog/ui/dialog";

import Checkbox from "../base/Checkbox";

interface ConfirmDenyDialogProps {
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
  type: "approve" | "deny";
  text: string;
  showCheckbox?: boolean;
}

export function ConfirmationModal({
  open,
  title = "Confirm selection",
  onOpenChange,
  onAction,
  type,
  text,
  showCheckbox = false,
}: ConfirmDenyDialogProps) {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <DialogOverlay className="bg-gray-400 opacity-25" />{" "}
      <DialogContent className="border-1 max-w-md rounded-2xl border border-cream-500 bg-white px-[16px] pb-[56px] pt-[36px] dark:bg-dark-gray-600">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <DialogTitle className="pt-[12px] text-center text-[35px] font-medium text-gray-500 dark:text-gray-200">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-[16px] leading-[120%] text-dark-gray-500 dark:text-gray-300">
            {text}
          </DialogDescription>
          {showCheckbox && (
            <div>
              <Checkbox
                onCheckedChange={() => setChecked(!checked)}
                checked={checked}
                label={
                  <p className="font-[16px] text-dark-gray-500 dark:text-gray-300">
                    I agree to{" "}
                    <a
                      href="/docs/placeholder.pdf"
                      className="text-green-500 underline dark:text-mint-200"
                    >
                      Terms and Conditions
                    </a>
                  </p>
                }
                id={"approve-checkbox"}
              />
            </div>
          )}
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outlined" className="px-6 py-1">
              Cancel
            </Button>
          </DialogClose>

          <Button
            className="px-6 py-1 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
            onClick={onAction}
            variant={"contained"}
            disabled={showCheckbox ? !checked : false}
          >
            {type === "approve" ? "Approve" : "Deny"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
