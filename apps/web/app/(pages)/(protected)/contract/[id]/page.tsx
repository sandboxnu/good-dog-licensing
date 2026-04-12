import { forbidden } from "next/navigation";

import PageContainer from "@good-dog/components/PageContainer";
import ContractView from "@good-dog/components/contract/ContractView";
import { HydrateClient, trpc } from "@good-dog/trpc/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractPage({ params }: PageProps) {
  const { id: contractId } = await params;
  const user = await trpc.user();

  if (!user) {
    forbidden();
  }

  void trpc.getContractById.prefetch({ contractId });

  return (
      <HydrateClient>
        <ContractView contractId={contractId} />
      </HydrateClient>
  );
}
