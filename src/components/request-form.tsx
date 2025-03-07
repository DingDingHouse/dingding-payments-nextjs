"use client"

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Check, ChevronsUpDown, Search } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createRequest } from "@/app/(dashboard)/requests/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useAppSelector } from "@/lib/hooks";
import { Roles, User } from "@/lib/types";
import { getDescendants } from "@/lib/actions";


interface RequestFormProps {
    onClose: () => void;
    initialWalletId?: string;
    initialQrId?: string;
}


interface WalletFormProps {
    initialWalletId?: string;
    initialQrId?: string;
    shouldAutoOpen?: boolean;
}

export function CreateRequestButton({
    initialWalletId,
    initialQrId,
    shouldAutoOpen
}: {
    initialWalletId?: string;
    initialQrId?: string;
    shouldAutoOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (shouldAutoOpen) {
            setIsOpen(true);
        }
    }, [shouldAutoOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] md:max-w-[650px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Request</DialogTitle>
                    <DialogDescription>
                        Submit a new recharge or redeem request
                    </DialogDescription>
                </DialogHeader>
                <RequestForm
                    onClose={() => setIsOpen(false)}
                    initialWalletId={initialWalletId}
                    initialQrId={initialQrId}
                />
            </DialogContent>
        </Dialog>
    );
}


export default function RequestForm({ onClose, initialWalletId, initialQrId }: RequestFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState<"deposit" | "withdrawal">("deposit");
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [qrReference, setQrReference] = useState(initialQrId || "");
    const [notes, setNotes] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    const currentUser = useAppSelector(state => state.users.currentUser);
    const isPlayer = currentUser?.role.name === Roles.PLAYER;

    const [players, setPlayers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [openCombobox, setOpenCombobox] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [paymentMethod, setPaymentMethod] = useState<"bank" | "upi">("bank");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [branchCode, setBranchCode] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [upiId, setUpiId] = useState("");


    useEffect(() => {
        if (!isPlayer) {
            const fetchPlayers = async () => {
                const { data, error } = await getDescendants({ role: 'player' });
                if (!error && data) {
                    setPlayers(data.data);
                }
            };
            fetchPlayers();
        }
    }, [isPlayer]);

    // Simple validation function
    const validateForm = () => {
        if (!isPlayer && !selectedUserId) {
            toast({
                title: "Validation Error",
                description: "Please select a player",
                variant: "destructive",
            });
            return false;
        }

        if (!type) {
            toast({
                title: "Validation Error",
                description: "Please select a request type",
                variant: "destructive",
            });
            return false;
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            toast({
                title: "Validation Error",
                description: "Please enter a valid amount greater than 0",
                variant: "destructive",
            });
            return false;
        }

        // Validate withdrawal payment information
        if (type === "withdrawal") {
            if (paymentMethod === "bank") {
                if (!bankName || !accountNumber || !accountName || !ifscCode) {
                    toast({
                        title: "Validation Error",
                        description: "Please fill in all required bank details",
                        variant: "destructive",
                    });
                    return false;
                }
            } else if (paymentMethod === "upi" && !upiId) {
                toast({
                    title: "Validation Error",
                    description: "Please enter a valid UPI ID",
                    variant: "destructive",
                });
                return false;
            }
        }

        return true;
    };

    const clearUrlAndClose = () => {
        // Clear URL parameters and close dialog
        router.replace('/requests', { scroll: false });
        onClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("type", type);
            formData.append("amount", amount);

            if (transactionId) {
                formData.append("transactionId", transactionId);
            }

            if (qrReference) {
                formData.append("qrReference", qrReference);
            }

            if (notes) {
                formData.append("notes", notes);
            }

            if (file) {
                formData.append("paymentScreenshot", file);
            }

            if (!isPlayer && selectedUserId) {
                formData.append("userId", selectedUserId);
            }

            // Add withdrawal payment information if applicable
            if (type === "withdrawal") {
                formData.append("paymentMethod", paymentMethod);

                if (paymentMethod === "bank") {
                    if (bankName) formData.append("bankName", bankName);
                    if (accountNumber) formData.append("accountNumber", accountNumber);
                    if (accountName) formData.append("accountName", accountName);
                    if (branchCode) formData.append("branchCode", branchCode);
                    if (ifscCode) formData.append("ifscCode", ifscCode);
                } else if (paymentMethod === "upi") {
                    if (upiId) formData.append("upiId", upiId);
                }
            }

            const response = await createRequest(formData);

            if (response.error) {
                toast({
                    title: "Error",
                    description: response.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Your request has been submitted successfully",
                });

                clearUrlAndClose();

            }
        } catch {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (initialWalletId) {
            setTransactionId(initialWalletId);
        }
        if (initialQrId) {
            setQrReference(initialQrId);
        }
    }, [initialWalletId, initialQrId]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="type">Request Type</Label>
                <Select
                    value={type}
                    onValueChange={(value) => setType(value as "deposit" | "withdrawal")}
                    disabled={isLoading}
                >
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select a request type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                    Select whether you want to deposit or withdraw funds.
                </p>
            </div>

            {!isPlayer && (
                <div className="space-y-2">
                    <Label htmlFor="userId">Select Player</Label>
                    <div className="relative">
                        <div className="relative">
                            <Input
                                placeholder="Search players..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-2"
                            />
                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <Select
                            value={selectedUserId}
                            onValueChange={setSelectedUserId}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a player" />
                            </SelectTrigger>
                            <SelectContent>
                                {players
                                    .filter(player =>
                                        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        player.username.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((player) => (
                                        <SelectItem
                                            key={player._id}
                                            value={player._id}
                                        >
                                            {player.name} ({player.username})
                                        </SelectItem>
                                    ))
                                }
                                {players.filter(player =>
                                    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    player.username.toLowerCase().includes(searchQuery.toLowerCase())
                                ).length === 0 && (
                                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground">
                                            No players found
                                        </div>
                                    )}
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Select the player for whom you want to create the request.
                    </p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    disabled={isLoading}
                    required
                />
            </div>

            {type === "withdrawal" && (
                <>
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="bank"
                                    name="paymentMethod"
                                    checked={paymentMethod === "bank"}
                                    onChange={() => setPaymentMethod("bank")}
                                    className="h-4 w-4 rounded-full"
                                />
                                <Label htmlFor="bank" className="cursor-pointer">Bank Transfer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="upi"
                                    name="paymentMethod"
                                    checked={paymentMethod === "upi"}
                                    onChange={() => setPaymentMethod("upi")}
                                    className="h-4 w-4 rounded-full"
                                />
                                <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
                            </div>
                        </div>
                    </div>

                    {paymentMethod === "bank" ? (
                        <div className="space-y-4 border rounded-md p-4 bg-muted/30">
                            <h3 className="font-medium">Bank Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName">Bank Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="bankName"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        placeholder="Enter bank name"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accountName">Account Holder Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="accountName"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="Enter account holder name"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber">Account Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="accountNumber"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="Enter account number"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ifscCode">IFSC Code <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="ifscCode"
                                        value={ifscCode}
                                        onChange={(e) => setIfscCode(e.target.value)}
                                        placeholder="Enter IFSC code"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="branchCode">Branch Code (Optional)</Label>
                                    <Input
                                        id="branchCode"
                                        value={branchCode}
                                        onChange={(e) => setBranchCode(e.target.value)}
                                        placeholder="Enter branch code"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // UPI section remains the same
                        <div className="space-y-4 border rounded-md p-4 bg-muted/30">
                            <h3 className="font-medium">UPI Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="upiId">UPI ID <span className="text-red-500">*</span></Label>
                                <Input
                                    id="upiId"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="Enter UPI ID (e.g., name@upi)"
                                    disabled={isLoading}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Enter your UPI ID such as name@ybl, phone@okicici, etc.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}



            {type === "deposit" && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                            <Input
                                id="transactionId"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter transaction ID"
                                disabled={isLoading}
                            />
                            <p className="text-sm text-muted-foreground">
                                If available, enter the transaction ID from your payment.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="qrReference">QR Reference (Optional)</Label>
                            <Input
                                id="qrReference"
                                value={qrReference}
                                onChange={(e) => setQrReference(e.target.value)}
                                placeholder="Enter QR reference"
                                disabled={isLoading}
                            />
                            <p className="text-sm text-muted-foreground">
                                If you paid using a QR code, enter the reference number.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentScreenshot">Payment Screenshot (Optional)</Label>
                        <Input
                            id="paymentScreenshot"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                        <p className="text-sm text-muted-foreground">
                            Upload a screenshot of your payment confirmation.
                        </p>

                        {file && (
                            <div className="mt-2 bg-secondary/40 rounded-md p-2">
                                <p className="text-sm font-medium">Selected file:</p>
                                <p className="text-sm text-muted-foreground break-all truncate max-w-full" title={file.name}>
                                    {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional information about your request"
                    disabled={isLoading}
                />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={clearUrlAndClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
            </div>
        </form>
    );
}