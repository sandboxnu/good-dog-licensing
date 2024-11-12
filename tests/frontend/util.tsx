import { render } from "@testing-library/react";

import { TRPCProvider } from "@good-dog/trpc/client";

export const renderWithShell = (ui: React.ReactElement) => {
  return render(<TRPCProvider>{ui}</TRPCProvider>);
};
