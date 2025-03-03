"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";

interface QRCodeData {
    _id: string;
    walletId: string;
    title: string;
    qrcode: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface QRCodeResponse {
    success: boolean;
    message: string;
    data: QRCodeData[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

interface QRCodeGridProps {
    qrCodesData: QRCodeResponse;
}

export function QRCodeGrid({ qrCodesData }: QRCodeGridProps) {

    const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const { toast } = useToast();


    const handleQRClick = (qr: QRCodeData) => {
        setSelectedQR(qr);
        setIsQRDialogOpen(true);
    };

    const handleCreateRequest = () => {
        setIsQRDialogOpen(false);
        router.push(`/requests?type=deposit&walletId=${selectedQR?.walletId}&qrId=${selectedQR?._id}`);
    };

    const handleDownloadQR = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedQR) return;

        const link = document.createElement('a');
        link.href = selectedQR.qrcode;
        link.download = `qr-code-${selectedQR?.title?.replace(/\s+/g, '-').toLowerCase() || 'qr-code'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    if (!qrCodesData.data.length) {
        return (
            <div className="text-center p-8 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">No QR codes available for this payment method.</p>
            </div>
        );
    }

    // Create new URLSearchParams for pagination links
    const createPaginationLink = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return `?${params.toString()}`;
    };

    return (
        <>
            {/* QR Codes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {qrCodesData.data.map((qr) => (
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
                                    priority={currentPage === 1}
                                />
                            </div>
                            <p className="text-xs text-center font-medium truncate mt-2">{qr.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {qrCodesData.meta.pages > 1 && (
                <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t">
                    <Link href={createPaginationLink(currentPage - 1)}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>
                    </Link>

                    <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{currentPage}</span>
                        <span> of {qrCodesData.meta.pages} pages</span>
                        <span className="hidden sm:inline"> • {qrCodesData.meta.total} QR codes</span>
                    </div>

                    <Link href={createPaginationLink(currentPage + 1)}
                        className={currentPage >= qrCodesData.meta.pages ? 'pointer-events-none opacity-50' : ''}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            disabled={currentPage >= qrCodesData.meta.pages}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
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