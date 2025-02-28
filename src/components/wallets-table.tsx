"use client"
import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Wallet } from "@/lib/types"
import StatusBadge from "./status-badge"
import { ArrowDown, ArrowUp, MoreHorizontal, Pencil, QrCodeIcon, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { DateRangePicker } from "./date-range-picker"
import Image from "next/image"
import { useCallback, useState } from "react"
import { debounce } from "@/lib/utils"
import { Input } from "./ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UpdateWalletForm } from "./wallet-update"
import { deleteWallet } from "@/actions/wallets"

const walletColumns: ColumnDef<Wallet>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'logo',
        header: 'Logo',
        cell: ({ getValue }) => (
            <Image
                src={getValue() as string}
                alt="Wallet Logo"
                width={48}
                height={48}
                className="rounded-full object-cover"
            />
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
        accessorFn: (row) => row.createdBy.name,
        header: 'Created By',
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ getValue }) =>
            getValue()
                ? new Date(getValue() as string | number | Date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                : "N/A",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionMenu row={row.original} />,
    },

]

const ActionMenu = ({ row }: { row: Wallet }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

    const { toast } = useToast();
    const router = useRouter()


    const handleDelete = async () => {
        const result = await deleteWallet(row._id)
        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            })
        } else {
            toast({
                title: "Success",
                description: result.message || "User deleted successfully"
            })
            // Refresh the table data
            router.refresh()
        }
        setIsDeleteDialogOpen(false)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/wallets/${row._id}`}>
                            <QrCodeIcon className="mr-2 h-4 w-4" />
                            View QRs
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>


                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update Dialog */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                    </DialogHeader>
                    <UpdateWalletForm
                        wallet={row}
                        onSuccess={() => {
                            setIsUpdateDialogOpen(false)
                            router.refresh()
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Dailog  */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="sm:max-w-[425px] w-[95vw]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </>
    )
}

export default function WalletsTable({ data }: { data: Wallet[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const sortOrder = searchParams.get('sortOrder');
    const search = searchParams.get('search');

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            const params = new URLSearchParams(searchParams);
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }
            router.push(`?${params.toString()}`);
        }, 500),
        [searchParams, router]
    );


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <Input
                    placeholder="Search wallets..."
                    defaultValue={search || ""}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="max-w-xs"
                />
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                    <DateRangePicker />
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant={sortOrder === 'desc' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Link
                                href={{
                                    pathname,
                                    query: {
                                        ...Object.fromEntries(searchParams.entries()),
                                        sortBy: 'createdAt',
                                        sortOrder: 'desc'
                                    }
                                }}
                            >
                                <ArrowDown className="mr-2 h-4 w-4" />
                                Latest
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant={sortOrder === 'asc' ? 'default' : 'outline'}
                            size="sm"
                        >
                            <Link
                                href={{
                                    pathname,
                                    query: {
                                        ...Object.fromEntries(searchParams.entries()),
                                        sortBy: 'createdAt',
                                        sortOrder: 'asc'
                                    }
                                }}
                            >
                                <ArrowUp className="mr-2 h-4 w-4" />
                                Oldest
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <DataTable data={data || []} columns={walletColumns} />
        </div>
    )

}