import { config } from "@/lib/config";
import getCookie from "@/lib/getCookie";
import { ActionResponse, TransactionQuery } from "@/lib/types";

export async function getAllTransactions(query?: TransactionQuery): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        // Build query params
        const params = new URLSearchParams();

        // Add all possible query parameters
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.set(key, value.toString());
                }
            });
        }

        const response = await fetch(
            `${config.server}/api/transactions?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            }
        );
        console.log("Transactions response", response);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch transactions');
        }

        return {
            data: {
                data: data.data,
                meta: data.meta
            },
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch transactions'
        };
    }
}

export async function getTransactionsByUserAndDescendants(id: string, query?: TransactionQuery): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        // Build query params
        const params = new URLSearchParams();

        // Add all possible query parameters
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.set(key, value.toString());
                }
            });
        }

        const response = await fetch(`${config.server}/api/transactions/user/${id}/descendants?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch transaction');
        }

        return {
            data: {
                data: data.data,
                meta: data.meta
            },
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch transaction'
        };
    }
}