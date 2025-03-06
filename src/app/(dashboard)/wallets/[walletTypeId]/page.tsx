import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { WalletForm } from "@/components/wallet-form";
import WalletsTable from "@/components/wallets-table";
import { UserQuery } from "@/lib/types";
import Link from "next/link";
import { getWallets, getWalletsByType, getWalletTypes } from "../actions";
import { WalletTypeForm } from "@/components/wallet-type-form";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function WalletsPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    from?: string;
    to?: string;
    view?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
  params: Promise<{ walletTypeId: string }>;
}) {
  const searchParams = await props.searchParams;

  const filters: UserQuery = {
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    from: searchParams?.from,
    to: searchParams?.to,
    search: searchParams?.search,
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc",
  };

  const { data: walletTypes, error: walletTypesError } = await getWalletTypes();
  const { walletTypeId } = await props.params;
  const { data, error } = await getWalletsByType(walletTypeId, filters);

  if (walletTypesError) {
    return <div>Error: {walletTypesError}</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-10 thin-scrollbar">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <WalletTypeForm />
        {/* <WalletForm /> */}
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {walletTypes?.map((walletType: any) => (
              <Button
                key={walletType._id}
                asChild
                variant={
                  walletType._id === walletTypeId ? "default" : "outline"
                }
              >
                <Link href={`/wallets/${walletType._id}`}>
                  {walletType.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <WalletForm />
      </div>

      <WalletsTable data={data?.data} />

      {data?.meta && (
        <Pagination
          totalItems={data.meta.total}
          currentPage={data.meta.page}
          pageSize={data.meta.limit}
          className="justify-end flex-wrap mt-4"
        />
      )}
    </div>
  );
}
