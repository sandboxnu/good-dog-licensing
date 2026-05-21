"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { trpc } from "@good-dog/trpc/client";
import { Dialog, DialogContent, DialogTitle } from "@good-dog/ui/dialog";

import Button from "../base/Button";
import TextArea from "../base/TextArea";
import TextInput from "../base/TextInput";

export default function AddProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [mediaMakerName, setMediaMakerName] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setProjectName("");
    setMediaMakerName("");
    setDescription("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const createMutation = trpc.createGalleryProject.useMutation({
    onSuccess: () => {
      close();
      router.refresh();
    },
  });

  const canSubmit =
    projectName.trim() !== "" &&
    mediaMakerName.trim() !== "" &&
    description.trim() !== "" &&
    !createMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) close();
      }}
    >
      <DialogContent className="max-w-xl rounded-2xl border-dark-gray-500 bg-cream-100 p-[24px] text-dark-gray-500 dark:bg-dark-gray-600 dark:text-mint-300">
        <DialogTitle className="text-xl font-semibold dark:text-mint-300">
          Add project
        </DialogTitle>

        <div className="flex flex-col gap-[16px]">
          <TextInput
            id="add-project-name"
            label="Project name"
            placeholder="My new project"
            value={projectName}
            onChange={setProjectName}
            required
          />
          <TextInput
            id="add-media-maker-name"
            label="Media maker"
            placeholder="John Doe"
            value={mediaMakerName}
            onChange={setMediaMakerName}
            required
          />
          <TextArea
            id="add-description"
            label="Description"
            placeholder="What is the project about?"
            value={description}
            onChange={setDescription}
            required
          />
        </div>

        {createMutation.isError && (
          <p className="text-error">{createMutation.error.message}</p>
        )}

        <div className="flex justify-end gap-[12px]">
          <Button
            label="Cancel"
            size="small"
            variant="outlined"
            onClick={close}
          />
          <Button
            label={createMutation.isPending ? "Saving..." : "Create"}
            size="small"
            variant="contained"
            disabled={!canSubmit}
            onClick={() =>
              createMutation.mutate({
                projectName,
                mediaMakerName,
                description,
              })
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
