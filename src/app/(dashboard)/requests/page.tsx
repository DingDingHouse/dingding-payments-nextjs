import { Pagination } from "@/components/pagination";
import { RequestQuery, RequestType } from "./type";
import { getAllRequests } from "./actions";
import RequestsTable from "@/components/requests-table";
import { CreateRequestButton } from "@/components/request-form";
import BackToHome from "@/components/back-to-home";
import { whoIam } from "@/lib/actions";
export const dynamic = 'force-dynamic';

export default async function RequestsPage(props: {
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
    const searchParams = await props.searchParams;
    const shouldAutoOpen = !!(searchParams?.walletId && searchParams?.qrId);

    const { data: userData } = await whoIam();
    const isPlayer = userData?.role?.name === 'player';


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
    };

    const { data, error } = await getAllRequests(filters);
    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:p-10">
            <BackToHome isPlayer={isPlayer} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Requests</h1>
                <CreateRequestButton
                    initialWalletId={searchParams?.walletId}
                    initialQrId={searchParams?.qrId}
                    shouldAutoOpen={shouldAutoOpen}
                />
            </div>

            <RequestsTable data={data?.data} />

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