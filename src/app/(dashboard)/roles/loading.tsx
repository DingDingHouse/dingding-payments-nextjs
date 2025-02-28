export default function LoadingPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <div className="h-6 w-32 bg-muted animate-pulse rounded mb-4" />
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 border rounded">
                                <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="h-6 w-40 bg-muted animate-pulse rounded mb-4" />
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 border rounded">
                                <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}