import getCookie from "./getCookie";

export default async function apiFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
        throw new Error("No access token found");
    }

    const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        credentials: "include",
    });

    const jsonResponse = await response.json();

    if (!jsonResponse.success) {
        const errorMessage =
            jsonResponse.error?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    return jsonResponse;
}