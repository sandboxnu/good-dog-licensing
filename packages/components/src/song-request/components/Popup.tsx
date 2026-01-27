import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@good-dog/ui/dialog";

interface ConfirmDenyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
  type: "approve" | "deny";
}

export function Popup({
  open,
  onOpenChange,
  onAction,
  type,
}: ConfirmDenyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-8 bg-white">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-4xl text-center">
            Confirm selection
          </DialogTitle>

          <DialogDescription className="text-center text-base">
            {type === "approve"
              ? "Are you sure you want to request this song for licensing? This action cannot be undone."
              : "Are you sure you want to deny this song for licensing? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-4">
          <DialogClose asChild>
            <Button variant="outlined" className="px-6">
              Cancel
            </Button>
          </DialogClose>

          <Button className="px-6" onClick={onAction} variant={"contained"}>
            {type === "approve" ? "Approve" : "Deny"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
