import { getAllRequests } from "@/app/(dashboard)/requests/actions";
import { RequestQuery, RequestType } from "@/app/(dashboard)/requests/type";
import { Pagination } from "@/components/pagination";
import RequestsTable from "@/components/requests-table";
import { Card } from "@/components/ui/card";


export default async function SingleUserTransactionsPage(props: {
    params?: Promise<{ userId?: string }>,
    searchParams?: Promise<{
        page?: string;
        limit?: string;
        status?: string;
        type?: string;
        from?: string;
        to?: string;
        amount?: string;
        amountOp?: string;
        sortBy?: string;
        sortOrder?: string;
        search?: string;
        walletId?: string;
        qrId?: string;
    }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const filters: RequestQuery = {
        page: searchParams?.page ? parseInt(searchParams.page) : 1,
        limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
        status: searchParams?.status as 'pending' | 'approved' | 'rejected',
        type: searchParams?.type as RequestType,
        sortBy: searchParams?.sortBy,
        sortOrder: searchParams?.sortOrder as 'asc' | 'desc',
        search: searchParams?.search,
        from: searchParams?.from,
        to: searchParams?.to,
        userId: params?.userId
    };

    const { data, error } = await getAllRequests(filters);
    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }


    return (
        <Card>
            <RequestsTable data={data?.data} />

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