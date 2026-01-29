"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function UnauthenticatedWrapper() {
  const pathname = usePathname();

  useEffect(() => {
    const callbackUrl = pathname || "/";
    const loginUrl = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    window.location.href = loginUrl;
  }, [pathname]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to login...</p>
    </div>
  );
}
