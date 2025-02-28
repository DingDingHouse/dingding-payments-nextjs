import { getWallets } from "@/actions/wallets";
import { Pagination } from "@/components/pagination";
import { WalletForm } from "@/components/wallet-form";
import WalletsTable from "@/components/wallets-table";
import { UserQuery } from "@/lib/types";

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
    }>
}) {
    const searchParams = await props.searchParams;

    const filters: UserQuery = {
        page: searchParams?.page ? parseInt(searchParams.page) : 1,
        limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
        from: searchParams?.from,
        to: searchParams?.to,
        search: searchParams?.search,
        sortBy: searchParams?.sortBy,
        sortOrder: searchParams?.sortOrder as 'asc' | 'desc',
    };

    const { data, error } = await getWallets(filters);
    console.log(data);
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:p-10 thin-scrollbar">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Wallets</h1>
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
