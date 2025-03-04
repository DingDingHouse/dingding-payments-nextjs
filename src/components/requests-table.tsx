"use client"
import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { debounce, formatCurrency } from "@/lib/utils"
import StatusBadge from "./status-badge"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"
import { Input } from "./ui/input"
import { DateRangePicker } from "./date-range-picker"
import { ArrowDown, ArrowUp, CheckCircle, Eye, XCircle } from "lucide-react"
import { useCallback, useState } from "react"
import Image from "next/image"
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Request, RequestStatus } from "@/app/(dashboard)/requests/type"
import { approveRequest, rejectRequest } from "@/app/(dashboard)/requests/actions"
import { toast } from "@/hooks/use-toast"
import { useAppSelector } from "@/lib/hooks"

const statusVariants: Record<RequestStatus, { label: string, variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "warning" | "success" }> = {
    pending: { label: "Pending", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
}


const getRequestColumns = (
    onViewDetails: (request: Request) => void,
    onApprove: (request: Request) => void,
    onReject: (request: Request) => void,
    currentUser: any
): ColumnDef<Request>[] => [
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: ({ row }) => (
                <div className="flex items-center">
                    {new Date(row.getValue('createdAt')).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            )
        },
        {
            accessorKey: 'userId',
            header: 'User',
            cell: ({ row }) => {
                const user = row.original.userId;
                return (
                    <div className="flex items-center">
                        {user.name} ({user.username})
                    </div>
                );
            }
        },
        {
            accessorKey: 'type',
            header: () => <div className="text-center">Type</div>,
            cell: ({ getValue }) => {
                const type = getValue() as string;
                return (
                    <div className="flex justify-center">
                        {type === 'deposit' ? (
                            <StatusBadge status="Deposit" variant="transaction" />
                        ) : (
                            <StatusBadge status="Withdrawal" variant="transaction" />
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => (
                <div className="flex items-center">
                    {formatCurrency(row.getValue('amount'))}
                </div>
            )
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const status = getValue() as RequestStatus;
                const { label, variant } = statusVariants[status];
                return (
                    <StatusBadge status={label} variant={variant} />
                );
            }
        },
        {
            accessorKey: 'approverId',
            header: 'Processed By',
            cell: ({ getValue }) => {
                const approver = getValue() as Request['approverId'];
                return (
                    <div className="flex items-center">
                        {approver ? approver.name : '-'}
                    </div>
                );
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const request = row.original;
                const isOwnRequest = currentUser?._id === request.userId._id;

                return (
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => onViewDetails(request)} size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                        </Button>

                        {request.status === 'pending' && !isOwnRequest && (
                            <>
                                <Button onClick={() => onApprove(request)} size="sm" variant="ghost" className="text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => onReject(request)} size="sm" variant="ghost" className="text-red-600">
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                );
            }
        }
    ];

export default function RequestsTable({ data }: { data: Request[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const sortOrder = searchParams.get('sortOrder');
    const search = searchParams.get('search');

    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [processingRequest, setProcessingRequest] = useState<string | null>(null);
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [requestToProcess, setRequestToProcess] = useState<Request | null>(null);

    const currentUser = useAppSelector(state => state.users.currentUser);

    const handleViewDetails = (request: Request) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    const handleApproveClick = (request: Request) => {
        setRequestToProcess(request);
        setIsApproveDialogOpen(true);
    };

    const handleRejectClick = (request: Request) => {
        setRequestToProcess(request);
        setIsRejectDialogOpen(true);
    };

    const handleApprove = async () => {
        if (!requestToProcess) return;

        setProcessingRequest(requestToProcess._id);
        const { error } = await approveRequest(requestToProcess._id);

        if (error) {
            toast({
                title: "Error",
                description: `Failed to approve request: ${error}`,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: "Request approved successfully",
                variant: "default",
            });
            // Refresh the page to show updated data
            router.refresh();
        }
        setProcessingRequest(null);
        setRequestToProcess(null);
    };

    const handleReject = async () => {
        if (!requestToProcess) return;

        setProcessingRequest(requestToProcess._id);
        const { error } = await rejectRequest(requestToProcess._id);

        if (error) {
            toast({
                title: "Error",
                description: `Failed to reject request: ${error}`,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: "Request rejected successfully",
                variant: "default",
            });
            // Refresh the page to show updated data
            router.refresh();
        }
        setProcessingRequest(null);
        setRequestToProcess(null);
    };


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

    const columns = getRequestColumns(
        handleViewDetails,
        handleApproveClick,
        handleRejectClick,
        currentUser
    );


    return (
        <div className="space-y-6">
            <div className="mb-6 overflow-x-auto">
                <div className="flex flex-wrap gap-2 min-w-max">
                    <Button
                        asChild
                        variant={!status && !type ? 'default' : 'outline'}
                    >
                        <Link href={pathname}>All Requests</Link>
                    </Button>
                    <Button
                        asChild
                        variant={status === 'pending' ? 'default' : 'outline'}
                    >
                        <Link href="?status=pending">Pending</Link>
                    </Button>
                    <Button
                        asChild
                        variant={status === 'approved' ? 'default' : 'outline'}
                    >
                        <Link href="?status=approved">Approved</Link>
                    </Button>
                    <Button
                        asChild
                        variant={status === 'rejected' ? 'default' : 'outline'}
                    >
                        <Link href="?status=rejected">Rejected</Link>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <Input
                    placeholder="Search requests..."
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

            {processingRequest && (
                <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            <DataTable data={data || []} columns={columns} />

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Request ID</h3>
                                    <p className="text-sm break-all">{selectedRequest._id}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                    <div className="mt-1">
                                        {selectedRequest.status === 'pending' && (
                                            <StatusBadge status="Pending" variant="warning" />
                                        )}
                                        {selectedRequest.status === 'approved' && (
                                            <StatusBadge status="Approved" variant="success" />
                                        )}
                                        {selectedRequest.status === 'rejected' && (
                                            <StatusBadge status="Rejected" variant="destructive" />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                                    <p className="text-sm">{selectedRequest.type === 'recharge' ? 'Recharge' : 'Redeem'}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                                    <p className="text-sm font-medium">{formatCurrency(selectedRequest.amount)}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">User</h3>
                                    <p className="text-sm">{selectedRequest.userId.name} ({selectedRequest.userId.username})</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                                    <p className="text-sm">
                                        {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {selectedRequest.transactionId && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Transaction ID</h3>
                                        <p className="text-sm break-all">{selectedRequest.transactionId}</p>
                                    </div>
                                )}

                                {selectedRequest.qrReference && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">QR Reference</h3>
                                        <p className="text-sm break-all">{selectedRequest.qrReference}</p>
                                    </div>
                                )}

                                {selectedRequest.approverId && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Processed By</h3>
                                        <p className="text-sm">{selectedRequest.approverId.name}</p>
                                    </div>
                                )}
                            </div>

                            {selectedRequest.notes && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                                    <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedRequest.notes}</p>
                                </div>
                            )}

                            {selectedRequest.paymentScreenshot && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Screenshot</h3>
                                    <div className="relative h-[300px] w-full border rounded-md overflow-hidden bg-muted/20">
                                        <a href={selectedRequest.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                                            <Image
                                                src={selectedRequest.paymentScreenshot}
                                                alt="Payment Screenshot"
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-contain"
                                            />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {selectedRequest.status === 'pending' &&
                                currentUser?._id !== selectedRequest.userId._id && (
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            onClick={() => {
                                                setIsDetailsOpen(false);
                                                handleRejectClick(selectedRequest);
                                            }}
                                            variant="destructive"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsDetailsOpen(false);
                                                handleApproveClick(selectedRequest);
                                            }}
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve this request? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Approve
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this request? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReject}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}