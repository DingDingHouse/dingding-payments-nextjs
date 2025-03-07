"use client"

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Check, ChevronsUpDown, Search, X } from "lucide-react";
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
import { Roles } from "@/lib/types";
import { getDescendants } from "@/lib/actions";
import { User } from "@/lib/features/users/UsersSlice";


interface RequestFormProps {
    onClose: () => void;
    initialWalletId?: string;
    initialQrId?: string;
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
                // Include searchQuery in the API call if it exists
                const { data, error } = await getDescendants({
                    role: 'player',
                    search: searchQuery.trim() ? searchQuery : undefined
                });
                if (!error && data) {
                    setPlayers(data.data);
                }
            };

            // Use a debounce to avoid too many API calls when typing
            const timer = setTimeout(() => {
                fetchPlayers();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isPlayer, searchQuery]);

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
                // Add the selected player's username as userReference
                const selectedPlayer = players.find(p => p._id === selectedUserId);
                if (selectedPlayer) {
                    formData.append("userReference", selectedPlayer._id);
                }
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
                        <div className="flex items-center relative border rounded-md focus-within:ring-1 focus-within:ring-ring">
                            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search players by name or username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-1 h-7 w-7 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Always show player list when searching */}
                        {searchQuery.trim() !== "" && (
                            <div className="absolute z-10 mt-1 w-full bg-popover shadow-md rounded-md border p-0 overflow-hidden">
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="py-1">
                                    {players.length > 0 ? (
                                        players.map((player) => (
                                            <div
                                                key={player._id}
                                                onClick={() => {
                                                    setSelectedUserId(player._id);
                                                    setSearchQuery(""); // Clear search after selection
                                                }}
                                                className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors`}
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">{player.name}</div>
                                                    <div className="text-xs text-muted-foreground">@{player.username}</div>
                                                </div>
                                                {selectedUserId === player._id && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-3 text-sm text-muted-foreground">
                                            No matching players found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Selected player display */}
                        {selectedUserId && players.find(p => p._id === selectedUserId) && (
                            <div className="mt-3 bg-primary/10 rounded-md p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                                        {players.find(p => p._id === selectedUserId)?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {players.find(p => p._id === selectedUserId)?.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            @{players.find(p => p._id === selectedUserId)?.username}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedUserId("");
                                        setSearchQuery("");
                                    }}
                                    className="h-8 w-8 p-0 rounded-full"
                                >
                                    <span className="sr-only">Remove player</span>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {selectedUserId
                            ? "Selected player will receive the requested amount."
                            : "Search for players by name or username and select from the list."
                        }
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