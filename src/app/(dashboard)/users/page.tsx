import { Pagination } from "@/components/pagination";
import { UserForm } from "@/components/user-form";
import UsersTable from "@/components/user-table";
import { getDescendants } from "@/lib/actions";
import { UserQuery } from "@/lib/types";



export default async function UsersPage(props: {
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

    const { data, error } = await getDescendants(filters);
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:p-10 thin-scrollbar">
            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
                <UserForm />
            </div>

            <UsersTable data={data?.data} />

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
