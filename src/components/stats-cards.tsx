'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type StatsCardsProps = {
    metrics: {
        createdUsersCount: number;
        rechargeMetrics: {
            received: number;
            sent: number;
        };
        redeemMetrics: {
            deducted: number;
            received: number;
        };
    };
    userDetails: {
        balance: number;
    };
}


export function StatsCards({ metrics, userDetails }: StatsCardsProps) {
    const { createdUsersCount, rechargeMetrics, redeemMetrics } = metrics;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(userDetails.balance)}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Users Created</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{createdUsersCount}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Recharge Flow</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(rechargeMetrics.received)}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <p className="text-xs text-muted-foreground">Sent: {formatCurrency(rechargeMetrics.sent)}</p>
                        <p className="text-xs text-muted-foreground">Net: {formatCurrency(rechargeMetrics.received - rechargeMetrics.sent)}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Redeem Flow</CardTitle>
                    <ArrowDownLeft className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(redeemMetrics.received)}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <p className="text-xs text-muted-foreground">Deducted: {formatCurrency(redeemMetrics.deducted)}</p>
                        <p className="text-xs text-muted-foreground">Net: {formatCurrency(redeemMetrics.received - redeemMetrics.deducted)}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}