import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import { AddQRButton } from "@/components/add-qr-button";
import { QRCodesTable } from "@/components/qr-codes-table";
import { Pagination } from "@/components/pagination";
import { WalletQRQuery } from "@/lib/types";
import { getAWallet } from "../../../actions";
import BackButton from "@/components/back-button";


export default async function WalletPage(props: {
  params: Promise<{ walletId: string }>;
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    from?: string;
    to?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const filters: WalletQRQuery = {
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    from: searchParams?.from,
    to: searchParams?.to,
    search: searchParams?.search,
    sortBy: searchParams?.sortBy,
    sortOrder: searchParams?.sortOrder as "asc" | "desc",
    status: searchParams?.status,
  };

  const { data, error } = await getAWallet(params.walletId, filters);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-4">Wallet not found</div>;
  }

  const wallet = data.data;

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-6">
  

        <BackButton />

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Image
                  src={wallet.logo}
                  alt={wallet.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover ring-2 ring-muted"
                />
                <div>
                  <h1 className="text-2xl font-bold mb-2">{wallet.name}</h1>
                  {wallet.createdBy && (
                    <span className="text-sm text-muted-foreground">
                      Created by {wallet.createdBy.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <AddQRButton walletId={wallet._id} />
              </div>
            </div>
          </CardContent>
        </Card>

        <QRCodesTable data={wallet.qrCodes} walletId={wallet._id} />
        {data?.meta && (
          <Pagination
            totalItems={data.meta.total}
            currentPage={data.meta.page}
            pageSize={data.meta.limit}
            className="justify-end flex-wrap mt-4"
          />
        )}
      </div>
    </div>
  );
}
