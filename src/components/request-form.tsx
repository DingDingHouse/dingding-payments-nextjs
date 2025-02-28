"use client"

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
            <DialogContent className="sm:max-w-[500px] md:max-w-[600px]">
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

    // Simple validation function
    const validateForm = () => {
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

            {type === "deposit" && (
                <>
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