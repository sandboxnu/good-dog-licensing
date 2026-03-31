import clsx from "clsx";
import type { ReactNode } from "react";
import Button from "../../../base/Button";

interface ProfileSectionProps {
  header: string;
  transparentHeader?: boolean;
  danger?: boolean;
  editable?: boolean;
  editing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  children: ReactNode;
}

export default function ProfileSection({
  header,
  editable = false,
  editing = false,
  onEdit,
  onSave,
  onCancel,
  children,
}: ProfileSectionProps) {
  return (
    <div className="rounded-2xl bg-gray-100 dark:bg-green-600 border border-cream-400 dark:border-dark-gray-400">
      <header
        className={clsx(
          "rounded-t-2xl py-2.5 px-[23.5px] font-medium text-lg font-medium flex items-center justify-between bg-gray-200 dark:bg-mint-600 text-green-400 dark:text-mint-200",
        )}
      >
        {header}
        {editable && (
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button
                  size="small"
                  variant="contained"
                  label="Save"
                  onClick={onSave}
                />
                <Button
                  size="small"
                  variant="outlined"
                  label="Cancel"
                  onClick={onCancel}
                />
              </>
            ) : (
              <Button
                size="small"
                variant="outlined"
                displayIcon="pencil"
                label="Edit"
                onClick={onEdit}
              />
            )}
          </div>
        )}
      </header>
      {children}
    </div>
  );
}
