import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function DataTableSkeleton() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableHead key={i}>
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4, 5].map((row) => (
                        <TableRow key={row}>
                            {[1, 2, 3, 4, 5].map((cell) => (
                                <TableCell key={cell}>
                                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}