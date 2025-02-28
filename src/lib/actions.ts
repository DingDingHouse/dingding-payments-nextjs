
"use server";

import { config } from "./config";
import { ActionResponse, GamesQuery, Role, RolesResponse, TransactionQuery, UpdateRolePayload, UserQuery } from "./types";
import getCookie from "./getCookie";

export async function whoIam() {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${config.server}/api/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`

            },
            credentials: 'include'
        })

        const data = await response.json();
        if (!response.ok) {
            return { data: null, error: data.error.message || 'Failed to fetch user data' };
        }

        console.log('User data:', data.data);

        return { data: data.data, error: null };
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch user data' };
    }
}

export async function getUserById(userId: string) {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${config.server}/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`

            },
            credentials: 'include'
        })

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch user data');
        }

        return {
            data: data.data,
            message: data.message,
            error: null
        }

    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to update user'
        }
    }
}

export async function signOut() {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            throw new Error('No access token found');
        }

        const response = await fetch(`${config.server}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();
        console.log('Signed out', data);
        if (!response.ok) {
            throw new Error(data.message || 'Failed to sign out');
        }


        return data.data;

    } catch (error) {
        console.error('Failed to sign out:', error);
        return null;
    }
}

export async function createRole(name: string): Promise<ActionResponse<Role>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return {
                data: null,
                error: 'No access token found'
            };
        }

        const response = await fetch(`${config.server}/api/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ name }),
            credentials: 'include'

        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to create role'
            };
        }

        return {
            data: data.data,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to create role'
        };
    }
}

export async function getRoles(): Promise<ActionResponse<RolesResponse['data']>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return {
                data: null,
                error: 'No access token found'
            };
        }
        const response = await fetch(`${config.server}/api/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to fetch roles'
            };
        }

        return {
            data: data.data,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch roles'
        };
    }
}

export async function getRole(id: string): Promise<ActionResponse<Role>> {
    try {
        const accessToken = await getCookie('accessToken');
        if (!accessToken) {
            return {
                data: null,
                error: 'No access token found'
            };
        }

        const response = await fetch(`${config.server}/api/roles/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to fetch role'
            };
        }

        return {
            data: data.data,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch role'
        };
    }
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<ActionResponse<Role>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return { data: null, error: 'No access token found' };
        }

        const response = await fetch(`${config.server}/api/roles/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to update role'
            };
        }

        return {
            data: data.data,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to update role'
        };
    }
}

export async function deleteRole(id: string): Promise<ActionResponse<null>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return { data: null, error: 'No access token found' };
        }

        const response = await fetch(`${config.server}/api/roles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to delete role'
            };
        }


        return {
            data: null,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to delete role'
        };
    }
}

export async function getDescendants(query?: UserQuery): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');
        const params = new URLSearchParams();
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.set(key, value.toString());
                }
            });
        }

        const url = new URL(`${config.server}/api/users/me/descendants?${params.toString()}`);


        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch descendants');
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
            error: error instanceof Error ? error.message : 'Failed to fetch descendants'
        };
    }
}

export async function registerUser(data: {
    name: string;
    username: string;
    password: string;
    status: string;
}): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return { data: null, error: 'No access token found' };
        }

        const response = await fetch(`${config.server}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: responseData.error?.message || 'Failed to create user'
            };
        }

        return { data: responseData.data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to create user'
        };
    }
}


export async function deleteUser(id: string): Promise<ActionResponse<null>> {
    try {
        const accessToken = await getCookie('accessToken');

        const response = await fetch(`${config.server}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to delete user'
            };
        }

        return {
            data: null,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to delete user'
        };
    }
}


export async function updateUser(id: string, payload: any): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        const response = await fetch(`${config.server}/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        })

        if (!response.ok) {
            const errorText = await response.text()
            let errorMessage
            try {
                const errorJson = JSON.parse(errorText)
                errorMessage = errorJson.error?.message || 'Failed to update user'
            } catch {
                errorMessage = `Server error: ${response.status}`
            }
            return { data: null, error: errorMessage }
        }

        const data = await response.json()
        return {
            data: data.data,
            message: data.message,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to update user'
        }
    }
}

export async function updateUserPermissions(
    userId: string,
    data: {
        permissions: { resource: string; permission: string }[];
        operation: 'add' | 'remove';
    }
) {
    try {
        const accessToken = await getCookie('accessToken');


        const response = await fetch(`${config.server}/api/users/${userId}/permissions`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const responseData = await response.json();

        return {
            data: responseData.data,
            message: responseData.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to update user'
        };
    }
}

export async function getReport(dateRange?: { from?: string; to?: string }) {
    try {
        const accessToken = await getCookie('accessToken');
        const params = new URLSearchParams();
        if (dateRange?.from) params.set('from', dateRange.from);
        if (dateRange?.to) params.set('to', dateRange.to);

        const response = await fetch(`${config.server}/api/users/me/report?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch report');
        }

        return {
            data: data.data,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch report'
        };
    }
}

export async function getUserReport(userId: string, from?: string, to?: string): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);

        const response = await fetch(`${config.server}/api/users/${userId}/report?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch report');
        }

        return {
            data: data.data,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to fetch report'
        };
    }
}

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

export async function getUserDescendants(id: string, query?: UserQuery): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');
        const params = new URLSearchParams();
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.set(key, value.toString());
                }
            });
        }

        const response = await fetch(`${config.server}/api/users/${id}/descendants?${params.toString()}`, {
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

export async function createGame(formData: FormData): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return { data: null, error: 'No access token found' };
        }

        const response = await fetch(`${config.server}/api/games`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: formData,
            credentials: 'include'
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: responseData.error?.message || 'Failed to create game'
            };
        }

        return {
            data: responseData.data,
            error: null,
            message: responseData.message
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to create game'
        };
    }
}

export async function updateGame(id: string, payload: FormData): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');

        const response = await fetch(`${config.server}/api/games/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: payload,
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch transaction');
        }
        return {
            data: data.data,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to update game'
        };
    }
}

export async function deleteGame(id: string): Promise<ActionResponse<null>> {
    try {
        const accessToken = await getCookie('accessToken');

        if (!accessToken) {
            return { data: null, error: 'No access token found' };
        }

        const response = await fetch(`${config.server}/api/games/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error?.message || 'Failed to delete role'
            };
        }


        return {
            data: null,
            message: data.message,
            error: null
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Failed to delete role'
        };
    }
}

export async function getAllGames(query?: GamesQuery): Promise<ActionResponse<any>> {
    try {
        const accessToken = await getCookie('accessToken');
        const params = new URLSearchParams();
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.set(key, value.toString());
                }
            });
        }

        const response = await fetch(`${config.server}/api/games?${params.toString()}`, {
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