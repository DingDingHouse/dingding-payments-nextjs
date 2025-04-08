import { DepositInstructions } from "@/components/deposite-instruction";
import { Badge } from "@/components/ui/badge";
import { WalletTabs } from "@/components/wallets-tabs";
import { WalletType } from "@/lib/types";
import {
  Coins,
  FileText,
  LogOut,
  Sparkles,
  Star,
  Wallet,
  Wallet2,
} from "lucide-react";
import Link from "next/link";
import {
  getQRCodes,
  getWalletsByType,
  getWalletTypes,
} from "./wallets/actions";
import DepositCard from "@/components/deposit-card";
import { TawkWrapper } from "@/components/tawk-wrapper";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
// export const fetchCache = 'force-no-store';

export default async function PlayerHomePage(props: {
  searchParams?: Promise<{
    id?: string;
    type?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  // Fetch all wallet types
  const { data: walletTypes, error: walletTypesError } = await getWalletTypes();
  if (walletTypesError) {
    return <div>Error: {walletTypesError}</div>;
  }

  // Check if there are wallet types available
  const hasWalletTypes = walletTypes && walletTypes.length > 0;

  // Get selected wallet type or default to first one if available
  const selectedWalletTypeId = hasWalletTypes
    ? searchParams.type ?? walletTypes[0]?._id
    : "";

  // Fetch wallets only if we have a wallet type
  const walletResponse = hasWalletTypes
    ? await getWalletsByType(selectedWalletTypeId, { limit: 100 })
    : { data: null, error: null };

  if (walletResponse.error) {
    return <div>Error: {walletResponse.error}</div>;
  }

  // Check if there are wallets available
  const hasWallets = !!walletResponse.data?.data?.length;

  // Get selected wallet ID only if we have wallets
  const selectedWalletId = hasWallets
    ? searchParams.id ?? walletResponse.data.data[0]?._id
    : null;

  // Fetch QR codes only if we have a selected wallet
  const qrCodeResponse = selectedWalletId
    ? await getQRCodes({
        walletId: selectedWalletId,
        page,
        limit,
        status: "active",
      })
    : { data: null, error: null };

  return (
    <div className="w-full min-h-screen bg-[#050A30] text-white">
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[url('/casino-bg-pattern.png')] opacity-5 bg-repeat"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#4FB286] blur-[150px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#F9C80E] blur-[150px] opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-[#2C73D2] blur-[150px] opacity-10"></div>
      </div>

      <div className="mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 relative z-10">
        {/* Left sidebar - always visible */}
        <div className="w-full lg:w-[350px] space-y-6">
          {/* Navigation cards */}
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
            <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-xl p-4 shadow-lg hover:border-[#2C73D2]/60 transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(44,115,210,0.3)] h-full cursor-pointer">
              <TawkWrapper>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-[#4FB286] to-[#2C73D2] rounded-full shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Support</p>
                    <p className="text-[#8EACCD] text-xs">Get help</p>
                  </div>
                </div>
              </TawkWrapper>
            </div>
          </div>

          <DepositCard />
          <DepositInstructions />
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
        </div>

        {/* Right content area with payment methods */}
        <div className="flex-1 bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-[#2C73D2]/30 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Select Payment Method
              </h2>
              <p className="text-[#8EACCD] text-sm">
                Choose your preferred deposit option
              </p>
            </div>
            <TawkWrapper>
              <div className="hidden sm:block">
                <Badge className="bg-[#2C73D2]/30 text-[#8EACCD] hover:bg-[#2C73D2]/50 cursor-pointer">
                  Need Help?
                </Badge>
              </div>
            </TawkWrapper>
          </div>

          {/* Content based on data availability */}
          {!hasWalletTypes ? (
            // No wallet types available
            <div className="p-10 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#2C73D2]/30 mb-4">
                <Wallet2 className="h-8 w-8 text-[#8EACCD]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                No Payment Methods Available
              </h2>
              <p className="text-[#8EACCD] max-w-md mx-auto mb-6">
                Please contact support to set up payment methods for your
                account.
              </p>
              <TawkWrapper>
                <Button className="bg-[#2C73D2] hover:bg-[#2C73D2]/80 text-white">
                  Contact Support
                </Button>
              </TawkWrapper>
            </div>
          ) : (
            <>
              {/* Wallet Type Selection - shown if we have wallet types */}
              <div className="px-6 pt-6 overflow-x-auto pb-2">
                <div className="flex gap-3 mb-6 min-w-max">
                  {walletTypes.map((walletType: WalletType) => (
                    <Link
                      key={walletType._id}
                      href={`/?type=${walletType._id}${
                        selectedWalletId &&
                        walletType._id === selectedWalletTypeId
                          ? `&id=${selectedWalletId}`
                          : ""
                      }`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                        selectedWalletTypeId === walletType._id
                          ? "bg-[#2C73D2] text-white border border-[#2C73D2]"
                          : "bg-[#0A1149] border border-[#2C73D2]/20 text-[#8EACCD] hover:border-[#2C73D2]/50"
                      }`}
                    >
                      <div className="relative h-6 w-6 shrink-0">
                        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"></div>
                        <Image
                          src={walletType.logo}
                          alt={walletType.name}
                          fill
                          className="p-1 rounded-full object-contain"
                        />
                      </div>
                      <span className="font-medium">{walletType.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {!hasWallets ? (
                // No wallets for selected type
                <div className="px-6 pb-6 text-center py-10">
                  <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-[#2C73D2]/30 mb-4">
                    <Wallet className="h-8 w-8 text-[#8EACCD]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    No Wallets Available
                  </h2>
                  <p className="text-[#8EACCD] max-w-md mx-auto mb-6">
                    There are currently no wallets available for this payment
                    method.
                  </p>
                  <TawkWrapper>
                    <Button className="bg-[#2C73D2] hover:bg-[#2C73D2]/80 text-white">
                      Contact Support
                    </Button>
                  </TawkWrapper>
                </div>
              ) : (
                // Wallets available for selected type
                <div className="px-6 pb-6">
                  <WalletTabs
                    walletData={walletResponse.data.data}
                    selectedWalletId={selectedWalletId}
                    qrCodesData={qrCodeResponse.data}
                    qrCodesError={qrCodeResponse.error}
                    walletTypeId={selectedWalletTypeId} // Pass the walletTypeId to WalletTabs
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
