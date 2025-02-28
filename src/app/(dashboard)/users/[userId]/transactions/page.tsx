import { Pagination } from "@/components/pagination";
import TransactionsTable from "@/components/transactions-table";
import { Card } from "@/components/ui/card";
import { getTransactionsByUserAndDescendants } from "@/lib/actions";
import { TransactionQuery } from "@/lib/types";

export default async function SingleUserTransactionsPage(props: {
    params?: Promise<{ userId?: string }>,
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
    const params = await props.params;
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

    const userId = params?.userId ?? '';
    const { data, error } = await getTransactionsByUserAndDescendants(userId, filters);
    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <Card>
            <TransactionsTable data={data?.data} />
            {data?.meta && (
                <Pagination
                    totalItems={data.meta.total}
                    currentPage={data.meta.page}
                    pageSize={data.meta.limit}
                    className="justify-end flex-wrap mt-4"
                />
            )}
        </Card>
    )
}