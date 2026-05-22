"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { trpc } from "@good-dog/trpc/client";
import { Dialog, DialogContent, DialogTitle } from "@good-dog/ui/dialog";

import Button from "../base/Button";
import TextArea from "../base/TextArea";
import TextInput from "../base/TextInput";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const reset = () => {
    setProjectName("");
    setMediaMakerName("");
    setDescription("");
    setImageFile(null);
    setFileError(null);
    setUploadError(null);
    setSubmitAttempted(false);
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
  const uploadUrlMutation = trpc.createGalleryImageUploadUrl.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setImageFile(null);
      return;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setFileError("Image must be PNG, JPEG, WebP, or GIF.");
      setImageFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError("Image must be 50 MB or smaller.");
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (
      projectName.trim() === "" ||
      mediaMakerName.trim() === "" ||
      description.trim() === "" ||
      imageFile === null ||
      fileError !== null
    ) {
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    try {
      const { signedUrl, publicUrl } = await uploadUrlMutation.mutateAsync({
        contentType: imageFile.type,
        contentLength: imageFile.size,
      });
      const res = await fetch(signedUrl, {
        method: "PUT",
        body: imageFile,
        headers: { "Content-Type": imageFile.type },
      });
      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`);
      }
      await createMutation.mutateAsync({
        projectName,
        mediaMakerName,
        description,
        imageUrl: publicUrl,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isUploading || createMutation.isPending;

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
            errorText={
              submitAttempted && projectName.trim() === ""
                ? "Project name is required"
                : undefined
            }
          />
          <TextInput
            id="add-media-maker-name"
            label="Media maker"
            placeholder="John Doe"
            value={mediaMakerName}
            onChange={setMediaMakerName}
            required
            errorText={
              submitAttempted && mediaMakerName.trim() === ""
                ? "Media maker is required"
                : undefined
            }
          />
          <TextArea
            id="add-description"
            label="Description"
            placeholder="What is the project about?"
            value={description}
            onChange={setDescription}
            required
            errorText={
              submitAttempted && description.trim() === ""
                ? "Description is required"
                : undefined
            }
          />

          <div className="flex flex-col gap-[4px]">
            <label
              htmlFor="add-project-image"
              className="text-body3 font-normal text-dark-gray-600 dark:text-gray-100"
            >
              Image (max 50 MB){" "}
              <span className="text-required-star">*</span>
            </label>
            <input
              id="add-project-image"
              type="file"
              accept={ALLOWED_MIME_TYPES.join(",")}
              onChange={handleFileChange}
              className="text-body3 text-dark-gray-500 dark:text-gray-200"
            />
            {imageFile && (
              <p className="truncate text-caption text-dark-gray-400 dark:text-gray-300">
                <span className="truncate">{imageFile.name}</span>
                {" "}({(imageFile.size / (1024 * 1024)).toFixed(1)} MB)
              </p>
            )}
            {fileError && <p className="text-caption text-error">{fileError}</p>}
            {!fileError && submitAttempted && !imageFile && (
              <p className="text-caption text-error">Image is required</p>
            )}
          </div>
        </div>

        {(createMutation.isError || uploadError) && (
          <p className="text-error">
            {uploadError ?? createMutation.error?.message}
          </p>
        )}

        <div className="flex justify-end gap-[12px]">
          <Button
            label="Cancel"
            size="small"
            variant="outlined"
            onClick={close}
          />
          <Button
            label={
              isUploading
                ? "Uploading..."
                : createMutation.isPending
                  ? "Saving..."
                  : "Create"
            }
            size="small"
            variant="contained"
            disabled={isPending}
            onClick={() => void handleSubmit()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
