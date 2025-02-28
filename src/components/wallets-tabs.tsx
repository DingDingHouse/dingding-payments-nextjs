"use client";

import { useEffect, useState } from "react";
import { getWallets } from "@/actions/wallets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { WalletDetails } from "@/components/wallet-details";
import { QRCodeGrid } from "@/components/qr-code-grid";
import { useSidebar } from "./ui/sidebar";

interface Wallet {
    _id: string;
    name: string;
    logo: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    status: string;
}

export function WalletTabs() {
    const [allWallets, setAllWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const { state: sidebarState } = useSidebar();

    useEffect(() => {
        fetchAllWallets();
    }, []);

    // Fetch wallet data
    const fetchAllWallets = async () => {
        try {
            setLoading(true);
            const { data, error } = await getWallets({
                limit: 100,
                status: 'active'
            });

            if (error) {
                toast({
                    title: "Error",
                    description: error,
                    variant: "destructive",
                });
            } else if (data?.data) {
                const activeWallets = data.data.filter(
                    (wallet: Wallet) => wallet.status === "active"
                );
                setAllWallets(activeWallets);

                // Select first wallet by default
                if (activeWallets.length > 0) {
                    setSelectedWallet(activeWallets[0]);
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load wallets",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle wallet selection
    const handleWalletSelect = (wallet: Wallet) => {
        setSelectedWallet(wallet);
    };

    const handleViewRequests = () => {
        router.push('/requests');
    };

    if (loading && allWallets.length === 0) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (allWallets.length === 0) {
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
            <Tabs
                defaultValue={selectedWallet?._id || allWallets[0]?._id}
                value={selectedWallet?._id}
                onValueChange={(value) => {
                    const wallet = allWallets.find(w => w._id === value);
                    if (wallet) handleWalletSelect(wallet);
                }}
                className="w-full"
            >
                {/* Flexible tabs layout */}
                <Card className="mb-6 border-b-0 rounded-b-none">
                    <CardContent className="p-3 sm:p-4 bg-muted/30">
                        {/* Flexible wallet tabs with wrapping */}
                        <div className="flex flex-wrap gap-2">
                            {allWallets.map((wallet) => (
                                <button
                                    key={wallet._id}
                                    onClick={() => handleWalletSelect(wallet)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg border",
                                        "text-sm font-medium transition",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                        "min-w-0 max-w-full", // Allow flexible width based on content
                                        selectedWallet?._id === wallet._id
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
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tab content */}
                <div className="overflow-hidden">
                    {allWallets.map((wallet) => (
                        <div
                            key={wallet._id}
                            className={cn(
                                "transition-opacity duration-300",
                                selectedWallet?._id === wallet._id
                                    ? "block opacity-100"
                                    : "hidden opacity-0"
                            )}
                        >
                            <Card>
                                <WalletDetails wallet={wallet} />
                                <CardContent className="space-y-6">
                                    <QRCodeGrid walletId={wallet._id} />

                                    <div className="flex justify-center pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={handleViewRequests}
                                        >
                                            View My Payment Requests
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}