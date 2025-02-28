"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
    LineChart, Line, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ComposedChart, Area
} from 'recharts';

type ChartProps = {
    data: {
        timeRange: {
            from: string;
            to: string;
            duration: string;
        };
        createdUsers: Array<{
            _id: string;
            name: string;
            timestamp: string;
        }>;
        transactions: {
            recharge: Array<{
                _id: string;
                type: string;
                timestamp: string;
                amount: number;
                target: string;
            }>;
            redeem: Array<{
                _id: string;
                type: string;
                timestamp: string;
                amount: number;
                target: string;
            }>;
        };
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
    };
}

export function DashboardCharts({ data }: ChartProps) {
    // Process user creation data with dynamic time grouping
    const userCreationData = data.createdUsers.reduce((acc: any[], user) => {
        const timestamp = new Date(user.timestamp);
        const totalDays = (new Date(data.timeRange.to).getTime() - new Date(data.timeRange.from).getTime()) / (1000 * 60 * 60 * 24);

        let dateKey;
        if (totalDays <= 1) {
            // Group by hour if timeRange is 24h or less
            dateKey = timestamp.toISOString().split(':')[0] + ':00'; // Round to hour
        } else if (totalDays <= 7) {
            // Group by day if timeRange is a week or less
            dateKey = timestamp.toISOString().split('T')[0];
        } else {
            // Group by week for longer periods
            const weekStart = new Date(timestamp);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            dateKey = weekStart.toISOString().split('T')[0];
        }

        const existing = acc.find(x => x.date === dateKey);

        if (existing) {
            existing.count++;
            existing.users.push(user.name);
        } else {
            acc.push({
                date: dateKey,
                count: 1,
                users: [user.name],
                timestamp // Keep original timestamp for sorting
            });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const transactionData = [...data.transactions.recharge, ...data.transactions.redeem]
        .reduce((acc: any[], tx) => {
            const timestamp = new Date(tx.timestamp);
            const totalDays = (new Date(data.timeRange.to).getTime() - new Date(data.timeRange.from).getTime()) / (1000 * 60 * 60 * 24);

            // Dynamic time grouping
            let dateKey;
            if (totalDays <= 1) {
                dateKey = timestamp.toISOString().split(':')[0] + ':00';
            } else if (totalDays <= 7) {
                dateKey = timestamp.toISOString().split('T')[0];
            } else {
                const weekStart = new Date(timestamp);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                dateKey = weekStart.toISOString().split('T')[0];
            }

            const key = `${tx.type}_${tx.target}`;
            const existing = acc.find(x => x.date === dateKey);

            if (existing) {
                existing[key] = (existing[key] || 0) + tx.amount;
                existing.transactions = [...(existing.transactions || []), tx];
            } else {
                acc.push({
                    date: dateKey,
                    [key]: tx.amount,
                    transactions: [tx]
                });
            }
            return acc;
        }, [])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* User Creation Chart */}
            <Card className="md:col-span-1">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>User Creation Timeline</CardTitle>
                    <span className="text-sm text-muted-foreground">{data.timeRange.duration}</span>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userCreationData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={date => {
                                    const timestamp = new Date(date); // Convert string to Date object
                                    const totalDays =
                                        (new Date(data.timeRange.to).getTime() -
                                            new Date(data.timeRange.from).getTime()) /
                                        (1000 * 60 * 60 * 24);

                                    if (totalDays <= 1) {
                                        // Display time for a 24-hour range
                                        return timestamp.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        });
                                    } else if (totalDays <= 7) {
                                        // Display day and month for up to a week
                                        return timestamp.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        });
                                    } else {
                                        // Display "Week of..." for larger ranges
                                        return `Week of ${timestamp.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}`;
                                    }
                                }}
                            />
                            <YAxis />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload?.[0]) {
                                        return (
                                            <div className="bg-background border rounded p-2">
                                                <p className="font-medium">
                                                    {new Date(label).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                                {payload.map((entry: any) => (
                                                    <div key={entry.name} className="flex justify-between gap-4">
                                                        <span style={{ color: entry.color }}>{entry.name}:</span>
                                                        <span>{formatCurrency(entry.value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="stepAfter"
                                dataKey="count"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                name="Users Created"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>


            {/* Transaction Chart */}
            <Card className="md:col-span-1">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Transaction Flow</CardTitle>
                    <span className="text-sm text-muted-foreground">{data.timeRange.duration}</span>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={transactionData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={date => {
                                    const timestamp = new Date(date);
                                    const totalDays = (new Date(data.timeRange.to).getTime() - new Date(data.timeRange.from).getTime()) / (1000 * 60 * 60 * 24);

                                    if (totalDays <= 1) {
                                        return timestamp.toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });
                                    } else if (totalDays <= 7) {
                                        return timestamp.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        });
                                    } else {
                                        return `Week of ${timestamp.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}`;
                                    }
                                }}
                            />
                            <YAxis
                                tickFormatter={formatCurrency}
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload?.length) {
                                        return (
                                            <div className="bg-background border rounded p-2 space-y-2">
                                                <p className="font-medium">{new Date(label).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</p>
                                                {payload.map((entry: any) => (
                                                    <div key={entry.name} className="flex justify-between gap-4">
                                                        <span style={{ color: entry.color }}>{entry.name}:</span>
                                                        <span>{formatCurrency(entry.value)}</span>
                                                    </div>
                                                ))}
                                                <div className="text-xs text-muted-foreground mt-2">
                                                    Total Transactions: {payload[0].payload.transactions?.length || 0}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="recharge_received"
                                name="Recharge Received"
                                fill="#22c55e"
                                stroke="#22c55e"
                                fillOpacity={0.3}
                            />
                            <Area
                                type="monotone"
                                dataKey="recharge_sent"
                                name="Recharge Sent"
                                fill="#3b82f6"
                                stroke="#3b82f6"
                                fillOpacity={0.3}
                            />
                            <Bar
                                dataKey="redeem_received"
                                name="Redeem Received"
                                fill="#ef4444"
                            />
                            <Bar
                                dataKey="redeem_sent"
                                name="Redeem Sent"
                                fill="#dc2626"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}