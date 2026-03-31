import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@good-dog/ui/dialog";
import Checkbox from "../base/Checkbox";
import { useState } from "react";

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
      <DialogContent className="max-w-md rounded-2xl pt-[36px] pb-[56px] px-[16px] bg-white dark:bg-dark-gray-600 border border-1 border-cream-500">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <DialogTitle className="pt-[12px] text-[35px] font-medium text-center text-gray-500 dark:text-gray-200">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-dark-gray-500 dark:text-gray-300 text-[16px] leading-[120%]">
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
                      className="text-green-500 dark:text-mint-200 underline"
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
