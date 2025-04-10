import { config } from "@/lib/config";
import getCookie from "@/lib/getCookie";
import { ActionResponse, BannerQuery, TransactionQuery } from "@/lib/types";

export async function getAllPlatforms(
  query?: BannerQuery
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

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
      `${config.server}/api/platforms?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch platforms");
    }

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch platforms",
    };
  }
}

export async function getPlatformById(
  id: string
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/platforms/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch platform");
    }

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch platform",
    };
  }
}

export async function createPlatform(
  data: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/platforms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      credentials: "include",
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(
        responseData.error?.message || "Failed to create platform"
      );
    }

    return {
      data: responseData.data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create platform",
    };
  }
}

export async function updatePlatform(
  id: string,
  data: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/platforms/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.error?.message || "Failed to update platform"
      );
    }

    return {
      data: responseData.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to update platform",
    };
  }
}

export async function deletePlatform(id: string): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/platforms/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to delete platform");
    }

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete platform",
    };
  }
}
