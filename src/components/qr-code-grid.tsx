"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { QRCodeData, QRCodeResponse } from "@/lib/types";


interface QRCodeGridProps {
    qrCodesData: QRCodeResponse | null;
    qrCodesError: string | null;
}

export function QRCodeGrid({ qrCodesData, qrCodesError }: QRCodeGridProps) {

    const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);
    const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;


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


    if (qrCodesError) {
        return (
            <div className="p-6 bg-[rgba(248,102,36,0.1)] rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-[#F86624]" />
                <p className="text-[#F86624]">Error loading QR codes: {qrCodesError}</p>
            </div>
        );
    }

    if (!qrCodesData || !qrCodesData.success) {
        return (
            <div className="p-6 bg-[#0A1149] rounded-xl text-center">
                <p className="text-[#8EACCD]">Unable to load QR codes. Please try again later.</p>
            </div>
        );
    }


    if (!qrCodesData.data?.length) {
        return (
            <div className="p-6 bg-[#0A1149] rounded-xl text-center">
                <p className="text-[#8EACCD]">No QR codes available for this payment method.</p>
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
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Select a QR Code</h3>

                {/* QR Codes Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {qrCodesData.data.map((qr) => (
                        <div
                            key={qr._id}
                            onClick={() => handleQRClick(qr)}
                            className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                        >
                            <div className="bg-gradient-to-b from-[#2C73D2] to-[#0A1149] p-[2px] rounded-lg overflow-hidden shadow-lg">
                                <div className="bg-white p-3 rounded-md">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={qr.qrcode}
                                            alt={qr.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                            priority={currentPage === 1}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-[#F9C80E]/80 opacity-0 group-hover:opacity-20 transition-opacity rounded-lg"></div>
                            <p className="mt-1 text-xs text-center text-[#8EACCD] truncate">{qr.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {qrCodesData.meta.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#2C73D2]/20">
                    <Link href={createPaginationLink(currentPage - 1)}
                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-[#2C73D2]/20 text-[#8EACCD] hover:bg-[#2C73D2]/10"
                            disabled={currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>
                    </Link>

                    <div className="text-sm text-[#8EACCD]">
                        <span className="font-medium text-white">{currentPage}</span>
                        <span> of {qrCodesData.meta.pages} pages</span>
                    </div>

                    <Link href={createPaginationLink(currentPage + 1)}
                        className={currentPage >= qrCodesData.meta.pages ? 'pointer-events-none opacity-50' : ''}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 border-[#2C73D2]/20 text-[#8EACCD] hover:bg-[#2C73D2]/10"
                            disabled={currentPage >= qrCodesData.meta.pages}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )}

            {/* QR Detail Dialog with cool gaming UI */}
            <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
                <DialogContent className="bg-[#050A30] border-[#2C73D2] text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">{selectedQR?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 p-2">
                        <div className="bg-gradient-to-br from-[#2C73D2] to-[#0A1149] p-1 rounded-xl">
                            <div className="bg-white p-4 rounded-lg">
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
                        </div>

                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 border-[#2C73D2]/50 text-[#8EACCD] hover:bg-[#2C73D2]/10"
                                onClick={handleDownloadQR}
                            >
                                <Download className="h-4 w-4" />
                                <span>Download QR</span>
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="text-[#8EACCD] mb-2">Scan this QR code with your payment app</p>
                            <p className="font-bold text-white text-lg">Have you completed the payment?</p>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsQRDialogOpen(false)}
                            className="flex-1 border-[#2C73D2]/50 text-white hover:bg-[#2C73D2]/10"
                        >
                            Not yet
                        </Button>

                        <Button
                            onClick={handleCreateRequest}
                            className="flex-1 bg-gradient-to-r from-[#F9C80E] to-[#F86624] text-[#050A30] font-bold hover:brightness-110 border-none"
                        >
                            Yes, Create Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}