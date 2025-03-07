import WalletTypeTable from "@/components/wallet-type-table";
import { getWalletTypes } from "../actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function WalletsTypeUPdatePage() {
  const { data, error } = await getWalletTypes();
  console.log("data", data);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-10 thin-scrollbar">
      <div className="flex flex-col  justify-between gap-4 mb-6">
        <Link
          href="/wallets"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Wallets
        </Link>
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Wallet Types</h1>
        </div>
      </div>

      <WalletTypeTable data={data} />
    </div>
  );
}
