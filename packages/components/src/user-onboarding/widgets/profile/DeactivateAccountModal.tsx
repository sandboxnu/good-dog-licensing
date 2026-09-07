"use client";

import Button from "../../../base/Button";
import Modal from "../../../base/Modal";

interface DeactivateAccountModalProps {
  isOpen: boolean;
  close: () => void;
  onDeactivateAccount: () => void;
}

export default function DeactivateAccountModal({
  isOpen,
  close,
  onDeactivateAccount,
}: DeactivateAccountModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={close}
      headerText="Deactivate your account?"
      upperPadding={false}
      width={500}
      height={308}
      danger={true}
    >
      <div className="flex w-3/4 flex-col gap-4 pt-4">
        <div className="flex flex-col gap-[8px] text-dark-gray-500 dark:text-gray-300">
          Your entire account will be deactivated until you choose to reactivate
          it.
        </div>
        <div className="flex flex-row justify-center gap-2">
          <Button
            label="Deactivate Account"
            size="small"
            variant="contained"
            error
            onClick={onDeactivateAccount}
          />
          <Button
            label="Cancel"
            size="small"
            variant="outlined"
            onClick={close}
          />
        </div>
      </div>
    </Modal>
  );
}
