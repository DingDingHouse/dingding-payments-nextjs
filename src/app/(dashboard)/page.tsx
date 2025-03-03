import { getQRCodes, getWallets } from "@/actions/wallets";
import { DepositInstructions } from "@/components/deposite-instruction";
import { WalletTabs } from "@/components/wallets-tabs";
import { ActionResponse, QRCodeResponse } from "@/lib/types";

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
        <div className="p-4 sm:p-10 space-y-6 w-full overflow-hidden">
            <h1 className="text-2xl font-bold">Deposit Funds</h1>
            <WalletTabs
                walletData={walletsData.data}
                selectedWalletId={selectedWalletId}
                qrCodesData={qrCodesData}
                qrCodesError={qrCodesError}
            />
            <DepositInstructions />
        </div>
    );
}