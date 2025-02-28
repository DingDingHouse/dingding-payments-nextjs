"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Image from "next/image"
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
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
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { deleteQRCode, updateQRCode } from "@/actions/wallets"

// Import server actions

interface QRCode {
    _id: string;
    title: string;
    qrcode: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    walletId: string;
}

interface QRCodesTableProps {
    data: QRCode[];
    walletId: string;
}

export function QRCodesTable({ data, walletId }: QRCodesTableProps) {
    const columns: ColumnDef<QRCode>[] = [
        {
            accessorKey: "qrcode",
            header: "QR Code",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="relative h-16 w-16 shrink-0">
                        <div className="absolute inset-0 rounded-md bg-white dark:bg-white"> {/* Add white background */}
                            <Image
                                src={row.original.qrcode}
                                alt={row.original.title}
                                fill
                                className="rounded-md object-cover p-1" /* Added padding for better appearance */
                            />
                        </div>
                    </div>
                    <ImagePreview src={row.original.qrcode} alt={row.original.title} />
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    row.original.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                )}>
                    {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
                </div>
            ),
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
            cell: ({ row }) => <ActionMenu qr={row.original} walletId={walletId} />,
        },
    ]
    return <DataTable columns={columns} data={data} />
}

function ActionMenu({ qr, walletId }: { qr: QRCode; walletId: string }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        const result = await deleteQRCode(walletId, qr._id);

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            });
        } else {
            toast({
                title: "Success",
                description: "QR code deleted successfully"
            });
            router.refresh();
        }

        setIsDeleteDialogOpen(false);
    };

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

            {/* Update Dialog */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update QR Code</DialogTitle>
                    </DialogHeader>
                    <UpdateQRCodeForm
                        qr={qr}
                        walletId={walletId}
                        onSuccess={() => {
                            setIsUpdateDialogOpen(false);
                            router.refresh();
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="sm:max-w-[425px] w-[95vw]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete QR Code</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this QR code? This action cannot be undone.
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

function UpdateQRCodeForm({ qr, walletId, onSuccess }: { qr: QRCode; walletId: string; onSuccess: () => void }) {
    const [title, setTitle] = useState(qr.title);
    const [status, setStatus] = useState<string>(qr.status);
    const [imagePreview, setImagePreview] = useState<string>(qr.qrcode);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const result = await updateQRCode(walletId, qr._id, formData);

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error
            });
        } else {
            toast({
                title: "Success",
                description: "QR code updated successfully"
            });
            onSuccess();
        }
    };

    // Handle file change and preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    name="status"
                    value={status}
                    onValueChange={setStatus}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="qrcode">QR Code Image (Optional)</Label>
                <div className="flex items-center gap-4">
                    {imagePreview && (
                        <div className="relative h-20 w-20 shrink-0">
                            <Image
                                src={imagePreview}
                                alt="QR Code Preview"
                                fill
                                className="rounded-md object-cover"
                            />
                        </div>
                    )}
                    <Input
                        id="qrcode"
                        name="qrcode"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                    Save Changes
                </Button>
            </div>
        </form>
    );
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(true)}
            >
                <Eye className="h-4 w-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{alt}</DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[500px] w-full">
                        <div className="absolute inset-0 bg-white rounded-md"> {/* White background container */}
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain p-4" /* Added padding for better appearance */
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}