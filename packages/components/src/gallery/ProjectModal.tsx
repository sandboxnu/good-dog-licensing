"use client";

import type { GalleryProject } from "@good-dog/db";
import { Dialog, DialogContent, DialogTitle } from "@good-dog/ui/dialog";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: GalleryProject | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={project !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl rounded-2xl border-dark-gray-500 bg-cream-100 p-[24px] text-dark-gray-500 dark:bg-dark-gray-600 dark:text-mint-300">
        {project && (
          <div className="flex flex-col gap-3">
            <DialogTitle className="text-3xl font-semibold dark:text-mint-300">
              {project.projectName}
            </DialogTitle>

            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.projectName}
                className="h-[320px] w-full rounded-2xl object-cover"
              />
            )}

            <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-200">
              {project.mediaMakerName}
            </p>
            <p className="text-dark-gray-500 dark:text-gray-200">
              {project.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
