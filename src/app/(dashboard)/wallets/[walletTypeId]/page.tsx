import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { WalletForm } from "@/components/wallet-form";
import WalletsTable from "@/components/wallets-table";
import { Roles, UserQuery, WalletType } from "@/lib/types";
import Link from "next/link";
import { getWalletsByType, getWalletTypes } from "../actions";
import Image from "next/image";
import { whoIam } from "@/lib/actions";
import { root } from "postcss";
import { SelectWalletCreator } from "@/components/select-wallet-creator";

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
  const { data: user, error: userError } = await whoIam();

  if (userError) {
    return <div>Error: {userError}</div>;
  }

  const isRoot = user?.role.name === Roles.ROOT;

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

  if (isRoot) {
    return (
      <div className="p-4 sm:p-10 thin-scrollbar">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Wallets</h1>
          <div className="flex items-center gap-4">
            <Link href={`/wallets/types`} className="border rounded-md p-2">
              View Wallet Type
            </Link>
          </div>
        </div>
        <SelectWalletCreator
          walletTypes={walletTypes}
          walletTypeId={walletTypeId}
        />
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

  return (
    <div className="p-4 sm:p-10 thin-scrollbar">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <div className="flex items-center gap-4">
          <Link
            href={`/wallets/types`}
            className="rounded-md p-2 border hover:border-gray-300"
          >
            View Wallet Type
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {walletTypes?.map((walletType: WalletType) => (
              <div
                key={walletType._id}
                className={`flex gap-2 items-center p-2 rounded-md border cursor-pointer transition-all ${
                  walletType._id === walletTypeId
                    ? "bg-white text-black border-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={walletType.logo}
                  alt="Logo"
                  width={28}
                  height={28}
                />
                <Link href={`/wallets/${walletType._id}`}>
                  {walletType.name}
                </Link>
              </div>
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
