"use client";

import { Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Wallet {
    _id: string;
    name: string;
    logo: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    status: string;
}

interface WalletDetailsProps {
    wallet: Wallet;
}

export function WalletDetails({ wallet }: WalletDetailsProps) {
    const { toast } = useToast();

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${label} copied to clipboard`,
        });
    };

    return (
        <>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="relative h-12 w-12 shrink-0">
                    <Image
                        src={wallet.logo}
                        alt={wallet.name}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-medium">{wallet.name}</h2>
                    <p className="text-muted-foreground text-sm">
                        Select a QR code below to make a payment
                    </p>
                </div>
            </CardHeader>

            {wallet.accountNumber && (
                <div className="px-6 pt-2">
                    <div className="border rounded-md p-4 bg-secondary/20 space-y-3">
                        <h3 className="font-medium">Account Details</h3>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-muted-foreground">Bank Name:</div>
                            <div className="text-sm font-medium flex items-center justify-between">
                                {wallet.bankName}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleCopy(wallet.bankName || "", "Bank name")}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-muted-foreground">Account Name:</div>
                            <div className="text-sm font-medium flex items-center justify-between">
                                {wallet.accountName}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleCopy(wallet.accountName || "", "Account name")}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-muted-foreground">Account Number:</div>
                            <div className="text-sm font-medium flex items-center justify-between">
                                {wallet.accountNumber}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleCopy(wallet.accountNumber || "", "Account number")}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}