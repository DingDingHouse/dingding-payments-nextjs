import { Pagination } from "@/components/pagination";
import TransactionsTable from "@/components/transactions-table";
import { TransactionQuery } from "@/lib/types";
import { getAllTransactions } from "./actions";
import { whoIam } from "@/lib/actions";
import BackToHome from "@/components/back-to-home";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage(props: {
    searchParams?: Promise<{
        page?: string;
        limit?: string;
        from?: string;
        to?: string;
        type?: string;
        amount?: string;
        amountOp?: string;
        sortBy?: string;
        sortOrder?: string;
        search?: string;
    }>
}) {
    const searchParams = await props.searchParams;

    const filters: TransactionQuery = {
        page: searchParams?.page ? parseInt(searchParams.page) : 1,
        limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
        from: searchParams?.from,
        to: searchParams?.to,
        type: searchParams?.type as 'recharge' | 'redeem',
        amount: searchParams?.amount ? parseFloat(searchParams.amount) : undefined,
        amountOp: searchParams?.amountOp as 'gt' | 'lt' | 'eq',
        sortBy: searchParams?.sortBy,
        sortOrder: searchParams?.sortOrder as 'asc' | 'desc',
        search: searchParams?.search
    };

    const { data: userData } = await whoIam();
    const isPlayer = userData?.role?.name === 'player';


    const { data, error } = await getAllTransactions(filters);
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:p-10">
            <BackToHome isPlayer={isPlayer} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Transactions</h1>
            </div>

            <TransactionsTable data={data?.data} />

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
