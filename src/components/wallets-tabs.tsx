import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { WalletDetails } from "@/components/wallet-details";
import { QRCodeGrid } from "@/components/qr-code-grid";
import { QRCodeResponse } from "@/lib/types";

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
            <Card>
                <CardContent className="p-6 text-center">
                    <h2 className="text-xl font-medium mb-2">No Payment Methods Available</h2>
                    <p className="text-muted-foreground">
                        Please contact support to set up payment methods.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            <Card className="mb-6 border-b-0 rounded-b-none">
                <CardContent className="p-3 sm:p-4 bg-muted/30">
                    <div className="flex flex-wrap gap-2">
                        {walletData.map((wallet) => (
                            <Link
                                key={wallet._id}
                                href={`?walletId=${wallet._id}`}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg border",
                                    "text-sm font-medium transition",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    "min-w-0 max-w-full",
                                    activeWalletId === wallet._id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-card text-card-foreground hover:brightness-95"
                                )}
                            >
                                <div className="relative h-6 w-6 shrink-0">
                                    <Image
                                        src={wallet.logo}
                                        alt={wallet.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <span className="truncate">{wallet.name}</span>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {selectedWallet && (
                <Card>
                    <WalletDetails wallet={selectedWallet} />
                    <CardContent className="space-y-6">
                        <QRCodeGrid
                            qrCodesData={qrCodesData}
                            qrCodesError={qrCodesError}
                        />
                        <div className="flex justify-center pt-4">
                            <Link href="/requests" passHref>
                                <Button variant="outline">
                                    View My Payment Requests
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}