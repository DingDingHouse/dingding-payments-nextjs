"use server";

import { ActionResponse } from "@/lib/types";
import getCookie from "@/lib/getCookie";
import { config } from "@/lib/config";
import { revalidatePath } from "next/cache";
import { RequestQuery } from "./type";


export async function createRequest(formData: FormData): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return { data: null, error: 'No access token found' };
        }

        const response = await fetch(`${config.server}/api/requests`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to create request'
            };
        }

        // Revalidate the path to refresh the data
        revalidatePath('/requests');

        return {
            data: data.data,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to create request'
        };
    }
}

export async function getAllRequests(query?: RequestQuery): Promise<ActionResponse<any>> {
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
            `${config.server}/api/requests?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch requests');
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
            error: error instanceof Error ? error.message : 'Failed to fetch requests'
        };
    }
}

export async function getRequestById(id: string): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        const response = await fetch(`${config.server}/api/requests/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch request');
        }

        return {
            data: data.data,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch request'
        };
    }
}

// This would be in your actions.ts file
export async function approveRequest(
    id: string,
    notes?: string,
    approvedAmount?: number
): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        const response = await fetch(`${config.server}/api/requests/${id}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ notes, approvedAmount }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to approve request');
        }

        return {
            data: data.data,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to approve request'
        };
    }
}

export async function rejectRequest(id: string, notes?: string): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        const response = await fetch(`${config.server}/api/requests/${id}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ notes }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to reject request');
        }

        return {
            data: data.data,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to reject request'
        };
    }
}

export async function deleteRequest(id: string): Promise<ActionResponse<null>> {
    try {
        const accessToken = await getCookie('accessToken');

        const response = await fetch(`${config.server}/api/requests/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to delete request');
        }

        return {
            data: null,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to delete request'
        };
    }
}