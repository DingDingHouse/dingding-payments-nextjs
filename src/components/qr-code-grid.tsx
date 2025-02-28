"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LoaderCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { config } from "@/lib/config";
import getCookie from "@/lib/getCookie";

interface QRCode {
    _id: string;
    walletId: string;
    qrcode: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface QRCodeGridProps {
    walletId: string;
}

export function QRCodeGrid({ walletId }: QRCodeGridProps) {
    const [loading, setLoading] = useState(true);
    const [allQRCodes, setAllQRCodes] = useState<QRCode[]>([]);
    const [displayQRCodes, setDisplayQRCodes] = useState<QRCode[]>([]);
    const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
    const [qrPage, setQrPage] = useState(1);
    const [qrsPerPage] = useState(10);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchQRCodes();
    }, [walletId]);

    // Update displayed QR codes when page changes
    useEffect(() => {
        if (allQRCodes.length > 0) {
            const startIndex = (qrPage - 1) * qrsPerPage;
            const endIndex = startIndex + qrsPerPage;
            setDisplayQRCodes(allQRCodes.slice(startIndex, endIndex));
        }
    }, [qrPage, allQRCodes, qrsPerPage]);

    // Function to fetch all QR codes for a wallet
    const fetchQRCodes = async () => {
        setLoading(true);
        setAllQRCodes([]);
        setDisplayQRCodes([]);

        try {
            const accessToken = await getCookie('accessToken');

            if (!accessToken) {
                toast({
                    title: "Error",
                    description: "Authentication required",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            // Fetch all QR codes at once (no pagination from API)
            const url = `${config.server}/api/wallets/${walletId}/qrcodes?status=active&limit=100`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                toast({
                    title: "Error",
                    description: result.error?.message || `Failed to load QR codes: ${response.status}`,
                    variant: "destructive",
                });
            } else {
                setAllQRCodes(result.data);
                // Set displayQRCodes to the first page of QR codes
                setDisplayQRCodes(result.data.slice(0, qrsPerPage));
                setQrPage(1);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load QR codes",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle QR pagination
    const handlePrevQRPage = () => {
        if (qrPage > 1) {
            setQrPage(qrPage - 1);
        }
    };

    const handleNextQRPage = () => {
        const totalPages = Math.ceil(allQRCodes.length / qrsPerPage);
        if (qrPage < totalPages) {
            setQrPage(qrPage + 1);
        }
    };

    const handleQRClick = (qr: QRCode) => {
        setSelectedQR(qr);
        setIsQRDialogOpen(true);
    };

    const handleCreateRequest = () => {
        router.push(`/requests/new?type=deposit&walletId=${walletId}&qrId=${selectedQR?._id}`);
    };

    // Calculate total QR pages
    const totalQRPages = Math.ceil(allQRCodes.length / qrsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (allQRCodes.length === 0) {
        return (
            <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">No QR codes available for this payment method.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-3">
                {displayQRCodes.map((qr) => (
                    <div
                        key={qr._id}
                        className="cursor-pointer hover:bg-secondary/10 transition-colors border rounded-md overflow-hidden"
                        onClick={() => handleQRClick(qr)}
                    >
                        <div className="p-2">
                            <div className="relative aspect-square bg-white rounded-md">
                                <Image
                                    src={qr.qrcode}
                                    alt={qr.title}
                                    fill
                                    className="p-1 object-contain"
                                />
                            </div>
                            <p className="text-xs text-center font-medium truncate mt-2">{qr.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom QR Pagination */}
            {allQRCodes.length > qrsPerPage && (
                <div className="flex items-center justify-center gap-4 mt-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevQRPage}
                        disabled={qrPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Showing {displayQRCodes.length} of {allQRCodes.length} QR codes
                        {totalQRPages > 1 && ` • Page ${qrPage} of ${totalQRPages}`}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextQRPage}
                        disabled={qrPage === totalQRPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* QR Detail Dialog - Payment confirmation and request creation */}
            <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{selectedQR?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-md">
                            <div className="relative aspect-square">
                                {selectedQR && (
                                    <Image
                                        src={selectedQR.qrcode}
                                        alt={selectedQR.title}
                                        fill
                                        className="object-contain"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="text-center text-muted-foreground space-y-1">
                            <p>Scan this QR code with your payment app</p>
                            <p className="font-medium">Have you completed the payment?</p>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsQRDialogOpen(false)}
                            className="sm:flex-1"
                        >
                            Not yet
                        </Button>

                        <Button
                            onClick={handleCreateRequest}
                            className="sm:flex-1"
                        >
                            Yes, Create Payment Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}