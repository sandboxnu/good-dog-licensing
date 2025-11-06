"use client";

import "./sentry.client.config";

export default function SentryInitClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just wraps children so Sentry client config runs on the client
  return <>{children}</>;
}
