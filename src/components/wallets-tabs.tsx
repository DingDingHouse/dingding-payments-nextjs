import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WalletDetails } from "@/components/wallet-details";
import { QRCodeGrid } from "@/components/qr-code-grid";
import { QRCodeResponse } from "@/lib/types";
import { Wallet2 } from "lucide-react";

interface Wallet {
    _id: string;
    name: string;
    logo: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    status: string;
}

interface WalletTabsProps {
    walletData: Wallet[];
    selectedWalletId?: string;
    qrCodesData: QRCodeResponse | null;
    qrCodesError: string | null;
}

export function WalletTabs({
    walletData,
    selectedWalletId,
    qrCodesData,
    qrCodesError
}: WalletTabsProps) {
    const activeWalletId = selectedWalletId || walletData[0]?._id;
    const selectedWallet = walletData.find(w => w._id === activeWalletId);



    if (walletData.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#2C73D2]/30 mb-4">
                    <Wallet2 className="h-8 w-8 text-[#8EACCD]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Payment Methods Available</h2>
                <p className="text-[#8EACCD] max-w-md mx-auto mb-6">
                    Please contact support to set up payment methods for your account.
                </p>
                <Button className="bg-[#2C73D2] hover:bg-[#2C73D2]/80 text-white">
                    Contact Support
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Wallet tabs - horizontal scrollable */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-1 px-1">
                {walletData.map((wallet) => (
                    <Link
                        key={wallet._id}
                        href={`?walletId=${wallet._id}`}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap transition-all",
                            activeWalletId === wallet._id
                                ? "bg-[#2C73D2] text-white border border-[#2C73D2]"
                                : "bg-[#0A1149] border border-[#2C73D2]/20 text-[#8EACCD] hover:border-[#2C73D2]/50"
                        )}
                    >
                        <div className="relative h-8 w-8 shrink-0">
                            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"></div>
                            <Image
                                src={wallet.logo}
                                alt={wallet.name}
                                fill
                                className="p-1 rounded-full object-contain"
                            />
                        </div>
                        <span className="font-medium">{wallet.name}</span>
                    </Link>
                ))}
            </div>

            {/* Selected wallet details */}
            {selectedWallet && (
                <div className="space-y-6">
                    <WalletDetails wallet={selectedWallet} />

                    <div className="border-t border-[#2C73D2]/20 pt-6">
                        <QRCodeGrid
                            qrCodesData={qrCodesData}
                            qrCodesError={qrCodesError}
                        />
                    </div>

                    <div className="flex justify-center pt-4 border-t border-[#2C73D2]/20">
                        <Link href="/requests" passHref>
                            <Button variant="outline" className="border-[#2C73D2]/50 text-[#8EACCD] hover:bg-[#2C73D2]/20">
                                View My Payment Requests
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}