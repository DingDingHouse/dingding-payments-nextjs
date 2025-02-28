"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getQRCodes } from "@/actions/wallets";
import { QRCode } from "@/lib/types";

interface QRCodeGridProps {
    walletId: string;
}

// Define a proper response type to match what getQRCodes returns
interface QRCodeResponse {
    data: QRCode[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export function QRCodeGrid({ walletId }: QRCodeGridProps) {
    const [loading, setLoading] = useState(true);
    const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
    const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const { toast } = useToast();
    const router = useRouter();

    // Fetch QR codes using server action
    async function fetchQRCodes() {
        setLoading(true);

        try {
            const { data, error } = await getQRCodes({
                walletId,
                page: currentPage,
                limit: itemsPerPage,
                status: 'active'
            });

            if (error) {
                toast({
                    title: "Error",
                    description: error,
                    variant: "destructive",
                });
                setQrCodes([]);
            } else if (data) {
                // Correctly access the data from the response
                const responseData = data as unknown as QRCodeResponse;
                setQrCodes(responseData.data || []);

                // Use the meta information from the response
                if (responseData.meta) {
                    setTotalItems(responseData.meta.total);
                    setTotalPages(responseData.meta.pages);
                } else {
                    setTotalItems(responseData.data.length);
                    setTotalPages(Math.ceil(responseData.data.length / itemsPerPage));
                }
            }
        } catch (error) {
            console.error('Error fetching QR codes:', error);
            toast({
                title: "Error",
                description: "Failed to load QR codes",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    // Rest of your component remains the same...
    // Fetch QR codes when wallet ID or page changes
    useEffect(() => {
        if (walletId) {
            fetchQRCodes();
        }
    }, [walletId, currentPage, itemsPerPage]);

    // Event handlers and rendering code...
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleQRClick = (qr: QRCode) => {
        setSelectedQR(qr);
        setIsQRDialogOpen(true);
    };

    const handleCreateRequest = () => {
        router.push(`/requests/new?type=deposit&walletId=${walletId}&qrId=${selectedQR?._id}`);
    };

    // Download QR code as image
    const handleDownloadQR = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedQR) return;

        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = selectedQR.qrcode;
        link.download = `qr-code-${selectedQR?.title?.replace(/\s+/g, '-').toLowerCase() || 'qr-code'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Loading skeleton
    if (loading && qrCodes.length === 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="space-y-2 border rounded-md p-2">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-3 w-3/4 mx-auto" />
                    </div>
                ))}
            </div>
        );
    }

    if (!loading && qrCodes.length === 0) {
        return (
            <div className="text-center p-8 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">No QR codes available for this payment method.</p>
            </div>
        );
    }

    return (
        <>
            {/* QR Codes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {qrCodes.map((qr) => (
                    <div
                        key={qr._id}
                        className="cursor-pointer border rounded-md overflow-hidden hover:shadow-md transition-all bg-card"
                        onClick={() => handleQRClick(qr)}
                    >
                        <div className="p-2">
                            <div className="relative aspect-square bg-white rounded-md">
                                <Image
                                    src={qr.qrcode}
                                    alt={qr.title}
                                    fill
                                    className="p-1 object-contain"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                    priority={currentPage === 1 && qrCodes.indexOf(qr) < 5}
                                />
                            </div>
                            <p className="text-xs text-center font-medium truncate mt-2">{qr.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{currentPage}</span>
                        <span> of {totalPages} pages</span>
                        <span className="hidden sm:inline"> • {totalItems} QR codes</span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center gap-1"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* QR Detail Dialog with enhanced UI */}
            <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-center">{selectedQR?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-inner">
                            <div className="relative aspect-square">
                                {selectedQR && (
                                    <Image
                                        src={selectedQR.qrcode}
                                        alt={selectedQR.title}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 450px) 100vw, 450px"
                                        priority
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={handleDownloadQR}
                            >
                                <Download className="h-4 w-4" />
                                <span>Download QR</span>
                            </Button>
                        </div>

                        <div className="text-center space-y-2 pb-2">
                            <p className="text-muted-foreground">Scan this QR code with your payment app</p>
                            <p className="font-medium text-foreground">Have you completed the payment?</p>
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
                            Yes, Create Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}