"use client"

import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Game } from "@/lib/types"
import { debounce } from "@/lib/utils"
import StatusBadge from "./status-badge"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"
import { Input } from "./ui/input"
import { ArrowDown, ArrowUp, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useCallback, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UpdateGameForm } from "./game-update"
import { deleteGame } from "@/lib/actions"

interface ActionMenuProps {
    row: Game;
    availableCategories: string[];
    availableTypes: string[];
}

const createColumns = (availableCategories: string[], availableTypes: string[]): ColumnDef<Game>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Image
                    src={row.original.thumbnail}
                    alt={row.getValue('name')}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded object-cover"
                />
                {row.getValue('name')}
            </div>
        )
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => (
            <div className="flex items-center">
                <StatusBadge status={getValue() as string} />
            </div>
        )
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ getValue }) => (
            <div className="flex items-center capitalize">
                {getValue() as string}
            </div>
        )
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
            <div className="flex items-center">
                <StatusBadge status={getValue() as string} />
            </div>
        )
    },
    {
        accessorKey: 'order',
        header: 'Order',
        cell: ({ getValue }) => (
            <div className="flex items-center">
                {getValue() as number}
            </div>
        )
    },
    {
        accessorKey: 'tag',
        header: 'Tag',
        cell: ({ getValue }) => (
            <div className="flex items-center font-mono">
                {getValue() as string}
            </div>
        )
    },
    {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ getValue }) => (
            <div className="max-w-[200px] truncate">
                <Link
                    href={getValue() as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    {getValue() as string}
                </Link>
            </div>
        )
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ getValue }) => (
            <div className="flex items-center font-mono text-sm">
                {getValue() as string}
            </div>
        )
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => (
            <div className="max-w-[200px] truncate" title={getValue() as string}>
                {getValue() as string}
            </div>
        )
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <ActionMenu
                row={row.original}
                availableCategories={availableCategories}
                availableTypes={availableTypes}
            />
        ),
    }
]

const ActionMenu = ({ row, availableCategories, availableTypes }: ActionMenuProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleDelete = async () => {
        const result = await deleteGame(row._id)
        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            })
        } else {
            toast({
                title: "Success",
                description: result.message || "Game deleted successfully"
            })
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

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Game</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this game? This action cannot be undone.
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

            {/* Update Dialog */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto thin-scrollbar">
                    <DialogHeader>
                        <DialogTitle>Update Game</DialogTitle>
                    </DialogHeader>
                    <UpdateGameForm
                        game={row}
                        availableCategories={availableCategories}
                        availableTypes={availableTypes}
                        onSuccess={() => {
                            setIsUpdateDialogOpen(false);
                            router.refresh();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default function GamesTable({
    data,
    availableCategories,
    availableTypes
}: {
    data: Game[],
    availableCategories: string[],
    availableTypes: string[]
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'createdAt';  // Default to createdAt
    const sortOrder = searchParams.get('sortOrder') || 'desc'; // Default to descending
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

    const columns = createColumns(availableCategories, availableTypes);


    return <div className="space-y-6">
        {/* Categories */}
        <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
                <Button
                    asChild
                    variant={!category ? 'default' : 'outline'}
                >
                    <Link href={pathname}>All Games</Link>
                </Button>
                {availableCategories.map((cat) => (
                    <Button
                        key={cat}
                        asChild
                        variant={category === cat ? 'default' : 'outline'}
                    >
                        <Link href={`?category=${cat}`}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Link>
                    </Button>
                ))}
            </div>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex gap-2 items-center">
                <Input
                    placeholder="Search games..."
                    defaultValue={search || ""}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="max-w-xs"
                />

                <Select
                    value={type || 'all'}
                    onValueChange={(value) => {
                        const params = new URLSearchParams(searchParams);
                        if (value !== 'all') {
                            params.set('type', value);
                        } else {
                            params.delete('type');
                        }
                        router.push(`${pathname}?${params}`);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {availableTypes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>


            {/* Sorting Options */}
            <div className="flex items-center gap-2">
                {/* Sorting Dropdown */}
                <Select
                    value={sortBy}
                    onValueChange={(value) => {
                        const params = new URLSearchParams(searchParams);
                        params.set("sortBy", value);
                        router.push(`${pathname}?${params}`);
                    }}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Created At</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Order Buttons */}
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
                                sortOrder: 'asc'
                            }
                        }}
                    >
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Asc
                    </Link>
                </Button>
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
                                sortOrder: 'desc'
                            }
                        }}
                    >
                        <ArrowDown className="mr-2 h-4 w-4" />
                        Desc
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                >
                    <Link
                        href={{
                            pathname,
                            query: {
                                ...Object.fromEntries(searchParams.entries()),
                                download: true
                            }
                        }}
                    >
                        Download
                    </Link>
                </Button>
            </div>
        </div>

        <DataTable data={data || []} columns={columns} />
    </div>
}