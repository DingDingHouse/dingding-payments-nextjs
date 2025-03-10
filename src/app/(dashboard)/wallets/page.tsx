
import { getWalletTypes } from "./actions";
import { WalletTypeForm } from "@/components/wallet-type-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

export default async function WalletsPage() {
  const { data: walletTypes, error: walletTypesError } = await getWalletTypes();

  // if wallet type is not empty then redirect to the first wallet type
  if (walletTypes?.length > 0) {
    redirect(`/wallets/${walletTypes[0]._id}`);
  }

  // if their is not wallets then show at the center of the page "No wallets found"
  const noWalletTypeFoundWidget = (
    <div className="flex items-center justify-center h-64">
      <p className="text-lg text-gray-500">No wallet Types found</p>
    </div>
  );

  if (walletTypesError) {
    return <div>Error: {walletTypesError}</div>;
  }

  return (
    <div className="p-4 sm:p-10 thin-scrollbar">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <WalletTypeForm />
      </div>

      {walletTypes?.length === 0 && noWalletTypeFoundWidget}
    </div>
  );
}
