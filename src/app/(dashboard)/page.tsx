import { getQRCodes, getWallets } from "@/actions/wallets";
import { DepositInstructions } from "@/components/deposite-instruction";
import { GlowingBackground } from "@/components/glow-background";
import SupportButton from "@/components/support-button";
import { Badge } from "@/components/ui/badge";
import { WalletTabs } from "@/components/wallets-tabs";
import { ActionResponse, QRCodeResponse } from "@/lib/types";
import { Coins, FileText, LogOut, Sparkles, Star } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function PlayerHomePage(props: {
    searchParams?: Promise<{
        walletId?: string;
        page?: string;
        limit?: string;
    }>
}) {
    const searchParams = await props.searchParams ?? {};
    const { data: walletsData, error: walletsError } = await getWallets({
        limit: 100,
    });
    if (walletsError) {
        return <div>Error: {walletsError}</div>
    }

    const selectedWalletId = searchParams.walletId ?? walletsData.data[0]?._id;
    const page = Number(searchParams.page) || 1;
    const limit = Number(searchParams.limit) || 10;

    // Fetch QR codes for selected wallet
    const { data: qrCodesData, error: qrCodesError }: ActionResponse<QRCodeResponse> = await getQRCodes({
        walletId: selectedWalletId,
        page,
        limit,
        status: 'active'
    });


    return (
        <div className="w-full min-h-screen bg-[#050A30] text-white">
            {/* Background animation elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute w-full h-full bg-[url('/casino-bg-pattern.png')] opacity-5 bg-repeat"></div>
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#4FB286] blur-[150px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#F9C80E] blur-[150px] opacity-10"></div>
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#2C73D2] blur-[150px] opacity-10"></div>
            </div>


            {/* Main layout with sidebar and content */}
            <div className="mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 relative z-10">
                {/* Left sidebar with deposit info */}
                <div className="w-full lg:w-[350px] space-y-6">
                    {/* Top action buttons */}
                    <div className="flex gap-3">
                        <Link href="/requests" className="flex-1">
                            <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-xl p-4 shadow-lg hover:border-[#2C73D2]/60 transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(44,115,210,0.3)] h-full">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-[#2C73D2] to-[#0A1149] rounded-full shadow-lg">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Requests</p>
                                        <p className="text-[#8EACCD] text-xs">View history</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <SupportButton />
                    </div>

                    <Link href="/logout" className="block w-full">
                        <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-red-500/30 rounded-xl p-4 shadow-lg hover:border-red-500/60 transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg">
                                    <LogOut className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Logout</p>
                                    <p className="text-[#8EACCD] text-xs">End session</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Deposit info card */}
                    <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-[#F9C80E] to-[#F86624] rounded-full shadow-lg">
                                <Coins className="h-7 w-7 text-[#050A30]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
                                <p className="text-[#8EACCD]">Boost your gaming balance</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#0A1149] rounded-lg p-4 border border-[#2C73D2]/20">
                                <div className="flex justify-between items-center">
                                    <p className="text-[#8EACCD]">Current Balance</p>
                                    <p className="text-[#F9C80E] font-bold">$0.00</p>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="relative inline-block">
                                    <button className="relative z-10 bg-gradient-to-r from-[#F9C80E] to-[#F86624] text-[#050A30] font-bold py-3 px-8 rounded-full hover:shadow-[0_0_20px_rgba(249,200,14,0.5)] transition-all">
                                        GET STARTED
                                    </button>
                                    <div className="absolute top-0 left-0 w-full h-full bg-white blur-md opacity-30 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current promotion */}
                    {/* <div className="bg-gradient-to-r from-[#2C73D2] to-[#0A1149] rounded-2xl overflow-hidden shadow-lg relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/confetti.png')] opacity-10 bg-repeat"></div>
                        <div className="p-5 relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-xl text-white">Welcome Bonus</h3>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-4 w-4 text-[#F9C80E] fill-[#F9C80E]" />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-white font-bold text-2xl">100% MATCH</p>
                                <p className="text-[#8EACCD]">Deposit now and double your playing power!</p>
                                <button className="bg-[#F9C80E] hover:bg-[#F86624] text-[#050A30] font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 w-full">
                                    CLAIM BONUS
                                </button>
                            </div>
                        </div>
                    </div> */}

                    <DepositInstructions />
                </div>

                {/* Right content area with payment methods */}
                <div className="flex-1 bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-[#2C73D2]/30 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Select Payment Method</h2>
                            <p className="text-[#8EACCD] text-sm">Choose your preferred deposit option</p>
                        </div>
                        <div className="hidden sm:block">
                            <Badge className="bg-[#2C73D2]/30 text-[#8EACCD] hover:bg-[#2C73D2]/50 cursor-pointer">
                                Need Help?
                            </Badge>
                        </div>
                    </div>

                    <div className="p-6">
                        <WalletTabs
                            walletData={walletsData.data}
                            selectedWalletId={selectedWalletId}
                            qrCodesData={qrCodesData}
                            qrCodesError={qrCodesError}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}