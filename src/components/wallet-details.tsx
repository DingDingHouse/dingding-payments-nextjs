"use client";

import { BanknoteIcon, Copy } from "lucide-react";
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `copied to clipboard`,
        });
    };

    // Only show the details section if we have account details
    if (!wallet.accountName && !wallet.accountNumber && !wallet.bankName) {
        return null;
    }

    return (
        <>
            <div className="bg-[#0A1149] rounded-xl border border-[#2C73D2]/20 p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative h-10 w-10 bg-white rounded-full overflow-hidden">
                        <Image
                            src={wallet.logo}
                            alt={wallet.name}
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{wallet.name}</h3>
                        <p className="text-xs text-[#8EACCD]">Account Details</p>
                    </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {wallet.bankName && (
                        <div className="bg-[rgba(44,115,210,0.1)] rounded-lg p-3">
                            <p className="text-xs text-[#8EACCD] mb-1">Bank Name</p>
                            <p className="text-white">{wallet.bankName}</p>
                        </div>
                    )}

                    {wallet.accountName && (
                        <div className="bg-[rgba(44,115,210,0.1)] rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-[#8EACCD] mb-1">Account Name</p>
                                <button
                                    onClick={() => handleCopy(wallet.accountName || '')}
                                    className="p-1 hover:bg-[#2C73D2]/20 rounded-md"
                                >
                                    <Copy className="h-3.5 w-3.5 text-[#8EACCD]" />
                                </button>
                            </div>
                            <p className="text-white">{wallet.accountName}</p>
                        </div>
                    )}

                    {wallet.accountNumber && (
                        <div className="bg-[rgba(44,115,210,0.1)] rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-[#8EACCD] mb-1">Account Number</p>
                                <button
                                    onClick={() => handleCopy(wallet.accountNumber || '')}
                                    className="p-1 hover:bg-[#2C73D2]/20 rounded-md"
                                >
                                    <Copy className="h-3.5 w-3.5 text-[#8EACCD]" />
                                </button>
                            </div>
                            <p className="text-white font-mono">{wallet.accountNumber}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}