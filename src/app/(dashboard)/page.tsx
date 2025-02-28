import { DepositInstructions } from "@/components/deposite-instruction";
import { WalletTabs } from "@/components/wallets-tabs";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function PlayerHomePage() {
    return (
        <div className="p-4 sm:p-10 space-y-6 w-full overflow-hidden">
            <h1 className="text-2xl font-bold">Deposit Funds</h1>
            <WalletTabs />
            <DepositInstructions />
        </div>
    );
}