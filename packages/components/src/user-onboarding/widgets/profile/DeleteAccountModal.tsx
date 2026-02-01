"use client";

import Modal from "../../../base/Modal";

import Button from "../../../base/Button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  close: () => void;
  onDeleteAccount: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  close,
  onDeleteAccount,
}: DeleteAccountModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={close}
      headerText="Delete your account?"
      upperPadding={false}
      width={500}
      height={308}
      danger={true}
    >
      <div className="flex flex-col w-3/4 gap-4 pt-4">
        <div className="flex flex-col gap-[8px] text-body-gray">
          This action cannot be undone. Your entire account will be permanently
          deleted.
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <Button
            label="Cancel"
            size="small"
            variant="outlined"
            onClick={close}
          />
          <Button
            label="Delete Account"
            size="small"
            variant="contained"
            error={true}
            onClick={onDeleteAccount}
          />
        </div>
      </div>
    </Modal>
  );
}
