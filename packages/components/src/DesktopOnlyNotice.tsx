"use client";

import { useRouter } from "next/navigation";

import { trpc } from "@good-dog/trpc/client";

import Button from "./base/Button";
import DeviceTooSmallSvg from "./svg/DeviceTooSmallSvg";

/**
 * Shown on phones in place of pages that only support desktop (e.g. the
 * admin/moderator dashboards). Signed-in users can still reach their
 * profile or log out from here.
 */
export default function DesktopOnlyNotice() {
  const router = useRouter();
  const [user] = trpc.user.useSuspenseQuery();

  const signOutMutation = trpc.signOut.useMutation({
    onSuccess: () => {
      window.location.replace("/");
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-[24px] rounded-[24px] border border-cream-400 bg-cream-100 px-[24px] py-[32px] text-center shadow-card-light dark:border-cream-600 dark:bg-green-600 dark:shadow-card-dark">
      <DeviceTooSmallSvg />
      <div className="flex flex-col gap-[8px]">
        {user && (
          <p className="text-body1 font-medium text-green-400 dark:text-mint-200">
            Hi {user.firstName}!
          </p>
        )}
        <h1 className="text-[28px] leading-tight font-semibold text-green-500 dark:text-mint-200">
          Please use a desktop
        </h1>
        <p className="text-body2 font-normal text-dark-gray-500 dark:text-gray-300">
          This page is designed for larger screens. Open Good Dog Licensing on a
          computer to continue.
        </p>
      </div>
      {user ? (
        <div className="flex w-full flex-col gap-[12px]">
          <Button
            label="View profile"
            size="medium"
            variant="contained"
            shadow
            fullWidth
            onClick={() => router.push("/profile")}
          />
          <Button
            label="Log out"
            size="medium"
            variant="outlined"
            fullWidth
            disabled={signOutMutation.isPending}
            onClick={() => signOutMutation.mutate()}
          />
        </div>
      ) : (
        <Button
          label="Go to home page"
          size="medium"
          variant="contained"
          shadow
          onClick={() => router.push("/")}
        />
      )}
    </div>
  );
}
