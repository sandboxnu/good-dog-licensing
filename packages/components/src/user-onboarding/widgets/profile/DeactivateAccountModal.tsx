"use client";

import Modal from "../../../base/Modal";

import Button from "../../../base/Button";

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
      <div className="flex flex-col w-3/4 gap-4 pt-4">
        <div className="flex flex-col gap-[8px] text-body-gray">
          Your entire account will be deactivated until you choose to reactivate
          it.
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <Button
            label="Cancel"
            size="small"
            variant="outlined"
            onClick={close}
          />
          <Button
            label="Deactivate Account"
            size="small"
            variant="contained"
            error
            onClick={onDeactivateAccount}
          />
        </div>
      </div>
    </Modal>
  );
}
