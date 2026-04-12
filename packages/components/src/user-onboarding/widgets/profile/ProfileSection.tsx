import type { ReactNode } from "react";
import clsx from "clsx";

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
    <div className="rounded-2xl border border-cream-400 bg-gray-100 dark:border-dark-gray-400 dark:bg-green-600">
      <header
        className={clsx(
          "flex items-center justify-between rounded-t-2xl bg-gray-200 px-[23.5px] py-2.5 text-lg font-medium text-green-400 dark:bg-mint-600 dark:text-mint-200",
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
