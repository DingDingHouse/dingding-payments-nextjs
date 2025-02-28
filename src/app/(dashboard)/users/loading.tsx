export default function LoadingPage() {
    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-[180px] bg-muted animate-pulse rounded" />
                    <div className="h-10 w-[300px] bg-muted animate-pulse rounded" />
                </div>
            </div>

            <div className="mb-6">
                <div className="flex gap-2">
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
            </div>

            <div className="rounded-md border">
                <div className="h-24 flex items-center justify-center">
                    <div className="h-4 w-[250px] bg-muted animate-pulse rounded" />
                </div>
            </div>
        </div>
    )
}