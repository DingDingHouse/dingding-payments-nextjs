import { Pagination } from "@/components/pagination";
import { Card } from "@/components/ui/card";
import UsersTable from "@/components/user-table";
import { getUserDescendants } from "@/lib/actions";
import { UserQuery } from "@/lib/types";

export default async function SingleUserDescendantsPage(props: {
    params?: Promise<{ userId?: string }>
    searchParams?: Promise<{
        page?: string;
        limit?: string;
        from?: string;
        to?: string;
        view?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
        role?: string;
        status?: string;
        username?: string;
    }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const filters: UserQuery = {
        page: searchParams?.page ? parseInt(searchParams.page) : 1,
        limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
        from: searchParams?.from,
        to: searchParams?.to,
        search: searchParams?.search,
        sortBy: searchParams?.sortBy,
        sortOrder: searchParams?.sortOrder as 'asc' | 'desc',
        view: searchParams?.view,
        role: searchParams?.role,
        status: searchParams?.status,
        username: searchParams?.username
    };

    const userId = params?.userId ?? '';
    const { data, error } = await getUserDescendants(userId, filters);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Card>
            <UsersTable data={data?.data} />
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