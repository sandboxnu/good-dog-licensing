"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function UnauthenticatedWrapper() {
  const pathname = usePathname();

  useEffect(() => {
    const callbackUrl = pathname || "/home";
    const loginUrl = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    window.location.href = loginUrl;
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
}
