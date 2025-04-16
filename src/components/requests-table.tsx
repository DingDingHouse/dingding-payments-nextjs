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
import { useCallback, useEffect, useState } from "react"
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
import { Request, RequestStatus, RequestType } from "@/app/(dashboard)/requests/type"
import { approveRequest, rejectRequest } from "@/app/(dashboard)/requests/actions"
import { toast } from "@/hooks/use-toast"
import { useAppSelector } from "@/lib/hooks"

const statusVariants: Record<RequestStatus, { label: string, variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "warning" | "success" }> = {
    pending: { label: "Pending", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    rejected: { label: "Rejected", variant: "destructive" },
}

const ResponsiveCell = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col space-y-1">
        <span className="text-xs font-medium text-muted-foreground md:hidden">{label}</span>
        <div className="truncate">{value}</div>
    </div>
);

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
                <ResponsiveCell
                    label="Date"
                    value={
                        <div className="whitespace-nowrap">
                            {new Date(row.getValue('createdAt')).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </div>
                    }
                />
            )
        },
        {
            accessorKey: 'userId',
            header: 'User',
            cell: ({ row }) => {
                const user = row.original.userId;
                return (
                    <ResponsiveCell
                        label="User"
                        value={
                            <div className="truncate max-w-[150px]" title={`${user.name} (${user.username})`}>
                                {user.name} <span className="text-muted-foreground">({user.username})</span>
                            </div>
                        }
                    />
                );
            }
        },
        {
            accessorKey: 'type',
            header: () => <div className="text-center">Type</div>,
            cell: ({ getValue }) => {
                const type = getValue() as string;
                return (
                    <ResponsiveCell
                        label="Type"
                        value={
                            <div className="flex justify-start md:justify-center">
                                {type === 'deposit' ? (
                                    <StatusBadge status="Deposit" variant="transaction" />
                                ) : (
                                    <StatusBadge status="Withdrawal" variant="transaction" />
                                )}
                            </div>
                        }
                    />
                );
            }
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => (
                <ResponsiveCell
                    label="Amount"
                    value={
                        <div className="font-medium">
                            {formatCurrency(row.getValue('amount'))}
                        </div>
                    }
                />
            )
        },

        {
            accessorKey: 'bankDetails',
            header: 'Payment Method',
            cell: ({ row }) => {
                const bankDetails = row.original.bankDetails;
                if (!bankDetails) return <ResponsiveCell label="Payment Method" value={<div className="text-muted-foreground text-sm">-</div>} />;

                if (bankDetails.upiId) {
                    return (
                        <ResponsiveCell
                            label="Payment Method"
                            value={
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-muted-foreground">UPI</span>
                                    <span className="text-sm truncate max-w-[120px]" title={bankDetails.upiId}>{bankDetails.upiId}</span>
                                </div>
                            }
                        />
                    );
                } else if (bankDetails.bankName) {
                    return (
                        <ResponsiveCell
                            label="Payment Method"
                            value={
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-muted-foreground">Bank</span>
                                    <span className="text-sm truncate max-w-[120px]" title={bankDetails.bankName}>{bankDetails.bankName}</span>
                                    <span className="text-xs text-muted-foreground" title={bankDetails.accountNumber}>
                                        {bankDetails.accountNumber?.slice(-4).padStart(bankDetails.accountNumber?.length, '•')}
                                    </span>
                                </div>
                            }
                        />
                    );
                }

                return <ResponsiveCell label="Payment Method" value={<div className="text-muted-foreground text-sm">-</div>} />;
            }
        },

        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ getValue }) => {
                const status = getValue() as RequestStatus;
                const { label, variant } = statusVariants[status];
                return (
                    <ResponsiveCell
                        label="Status"
                        value={<StatusBadge status={label} variant={variant} />}
                    />);
            }
        },

        {
            accessorKey: 'approvedAmount',
            header: 'Approved Amount',
            cell: ({ row }) => (
                <ResponsiveCell
                    label="Approved"
                    value={
                        <div className="font-medium">
                            {formatCurrency(row.getValue('approvedAmount'))}
                        </div>
                    }
                />
            )
        },
        {
            accessorKey: 'approverId',
            header: 'Processed By',
            cell: ({ getValue }) => {
                const approver = getValue() as Request['approverId'];
                return (
                    <ResponsiveCell
                        label="Processed By"
                        value={
                            <div className="truncate max-w-[120px]" title={approver?.name || '-'}>
                                {approver ? approver.name : '-'}
                            </div>
                        }
                    />
                );
            }
        },

        {
            id: 'actions',
            cell: ({ row }) => {
                const request = row.original;
                const isOwnRequest = currentUser?._id === request.userId._id;

                // Don't render any buttons during SSR
                const [mounted, setMounted] = useState(false);

                useEffect(() => {
                    setMounted(true);
                }, []);

                if (!mounted) {
                    return <div className="flex justify-end gap-2"></div>;
                }

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
    const [approvedAmount, setApprovedAmount] = useState<string>("");
    const [approvalNotes, setApprovalNotes] = useState<string>("");


    const currentUser = useAppSelector((state: { users: { currentUser: any } }) => state.users.currentUser);

    const handleViewDetails = (request: Request) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    const handleApproveClick = (request: Request) => {
        setRequestToProcess(request);
        // Pre-fill the amount field with the requested amount
        setApprovedAmount(request.amount.toString());
        setIsApproveDialogOpen(true);
    };

    const handleRejectClick = (request: Request) => {
        setRequestToProcess(request);
        setIsRejectDialogOpen(true);
    };

    const handleApprove = async () => {
        if (!requestToProcess) return;


        // Validate that amount is entered
        if (!approvedAmount.trim()) {
            toast({
                title: "Error",
                description: "Please enter the approved amount",
                variant: "destructive",
            });
            return;
        }

        // Validate that amount is a valid number
        const amount = parseFloat(approvedAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Error",
                description: "Please enter a valid amount greater than zero",
                variant: "destructive",
            });
            return;
        }


        setProcessingRequest(requestToProcess._id);
        const { error, message } = await approveRequest(
            requestToProcess._id,
            approvalNotes || undefined,
            amount
        );
        if (error) {
            toast({
                title: "Error",
                description: error || `Failed to approve request: ${error}`,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: message || "Request approved successfully",
                variant: "default",
            });
            // Refresh the page to show updated data
            router.refresh();
        }
        setProcessingRequest(null);
        setRequestToProcess(null);
        setApprovedAmount(""); // Reset the approved amount
        setApprovalNotes(""); // Reset the approval notes
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


                <div className="flex flex-nowrap gap-2 pb-2 min-w-max">
                    <Button
                        asChild
                        variant={!status && !type ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[80px]"
                    >
                        <Link href={pathname}>All</Link>
                    </Button>
                    <Button
                        asChild
                        variant={status === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[80px]"
                    >
                        <Link href="?status=pending">Pending</Link>
                    </Button>
                    <Button
                        asChild
                        variant={status === 'approved' ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[80px]"
                    >
                        <Link href="?status=approved">Approved</Link>
                    </Button>
                    <Button
                        asChild
                        variant={status === 'rejected' ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[80px]"
                    >
                        <Link href="?status=rejected">Rejected</Link>
                    </Button>
                </div>

                <div className="flex flex-nowrap gap-2 pt-2 min-w-max">
                    <span className="text-xs font-medium text-muted-foreground flex items-center mr-2">Type:</span>
                    <Button
                        asChild
                        variant={type === 'deposit' ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[80px]"
                    >
                        <Link
                            href={{
                                pathname,
                                query: {
                                    ...Object.fromEntries(searchParams.entries()),
                                    type: 'deposit'
                                }
                            }}
                        >
                            Deposits
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant={type === 'withdrawal' ? 'default' : 'outline'}
                        size="sm"
                        className="min-w-[80px]"
                    >
                        <Link
                            href={{
                                pathname,
                                query: {
                                    ...Object.fromEntries(searchParams.entries()),
                                    type: 'withdrawal'
                                }
                            }}
                        >
                            Withdrawals
                        </Link>
                    </Button>
                    {type && (
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="min-w-[80px]"
                        >
                            <Link
                                href={{
                                    pathname,
                                    query: {
                                        ...Object.fromEntries(
                                            Object.entries(Object.fromEntries(searchParams.entries()))
                                                .filter(([key]) => key !== 'type')
                                        )
                                    }
                                }}
                            >
                                Clear
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-4">
                <Input
                    placeholder="Search requests..."
                    defaultValue={search || ""}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="max-w-xs"
                />
                <div className="flex flex-wrap gap-2 items-center">
                    <DateRangePicker />
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant={sortOrder === 'desc' ? 'default' : 'outline'}
                            size="sm"
                            className="whitespace-nowrap"
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
                            className="whitespace-nowrap"
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

            <div className="overflow-hidden rounded-md border">
                <div className="overflow-x-auto">
                    <DataTable
                        data={data || []}
                        columns={columns}
                        className="w-full"
                    />
                </div>
            </div>
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-3xl overflow-y-scroll h-[85vh]">
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
                                    <p className="text-sm">{selectedRequest.type}</p>
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

                                {/* Bank details section */}
                                {selectedRequest.bankDetails && (
                                    <div className="col-span-2">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Details</h3>
                                        <div className="bg-muted/30 p-3 rounded-md">
                                            {selectedRequest.bankDetails.upiId ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium">UPI ID:</span>
                                                        <span className="text-sm">{selectedRequest.bankDetails.upiId}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium">Bank Name:</span>
                                                        <span className="text-sm">{selectedRequest.bankDetails.bankName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium">Account Name:</span>
                                                        <span className="text-sm">{selectedRequest.bankDetails.accountName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium">Account Number:</span>
                                                        <span className="text-sm">{selectedRequest.bankDetails.accountNumber}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm font-medium">IFSC Code:</span>
                                                        <span className="text-sm">{selectedRequest.bankDetails.ifscCode}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

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

                                {selectedRequest.processedAt && (
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Processed At</h3>
                                        <p className="text-sm">
                                            {new Date(selectedRequest.processedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
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
                            Review the request details and enter the approved amount.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {requestToProcess && (
                        <>
                            <div className="grid grid-cols-2 gap-4 py-2">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Request Type</h3>
                                    <p className="font-medium">
                                        {requestToProcess.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Requested Amount</h3>
                                    <p className="font-medium text-lg">
                                        {formatCurrency(requestToProcess.amount)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">User</h3>
                                    <p className="font-medium">
                                        {requestToProcess.userId.name}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t my-2"></div>

                            <div className="py-3">
                                <label htmlFor="approved-amount" className="text-sm font-medium mb-2 block">
                                    Approved Amount <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="approved-amount"
                                    type="number"
                                    value={approvedAmount}
                                    onChange={(e) => setApprovedAmount(e.target.value)}
                                    className="w-full"
                                    step="0.01"
                                    required
                                    min="0.01"
                                    placeholder="Enter approved amount"
                                />
                                <p className="text-sm text-muted-foreground mt-2">
                                    Enter the exact amount you want to approve (required)
                                </p>
                            </div>

                            <div className="py-3">
                                <label htmlFor="approval-notes" className="text-sm font-medium mb-2 block">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    id="approval-notes"
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    className="w-full min-h-[100px] p-3 border rounded-md bg-background"
                                    placeholder="Add any notes regarding this approval..."
                                />
                            </div>
                        </>
                    )}

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