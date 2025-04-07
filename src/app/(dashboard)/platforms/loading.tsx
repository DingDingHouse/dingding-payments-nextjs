export default function LoadingPage() {
  return (
    <div className="p-4 sm:p-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
      </div>

      <div className="space-y-6">
        {/* Filter buttons loading state */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-32 bg-muted rounded-md animate-pulse"
            />
          ))}
        </div>

        {/* Search and filters loading state */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="h-10 w-[200px] bg-muted rounded-md animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-[200px] bg-muted rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
          </div>
        </div>

        {/* Table loading state */}
        <div className="rounded-md border">
          <div className="w-full">
            {/* Table Header */}
            <div className="border-b">
              <div className="grid grid-cols-6 gap-4 p-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-muted rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Table Body */}
            <div className="rounded-md border">
              <div className="h-24 flex items-center justify-center">
                <div className="h-4 w-[250px] bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Pagination loading state */}
        <div className="flex justify-end mt-4 gap-2">
          <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
          <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
