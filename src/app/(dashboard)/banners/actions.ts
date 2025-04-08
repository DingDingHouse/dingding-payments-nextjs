import { config } from "@/lib/config";
import getCookie from "@/lib/getCookie";
import { ActionResponse, BannerQuery, TransactionQuery } from "@/lib/types";

export async function getAllBanners(
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
      `${config.server}/api/banners?${params.toString()}`,
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
      throw new Error(data.error?.message || "Failed to fetch banners");
    }

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch banners",
    };
  }
}

export async function getBannerById(id: string): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/banners/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch banner");
    }

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch banner",
    };
  }
}

export async function createBanner(
  data: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/banners`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      credentials: "include",
    });
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error?.message || "Failed to create banner");
    }

    return {
      data: responseData.data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create banner",
    };
  }
}

export async function updateBanner(
  id: string,
  data: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/banners/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error?.message || "Failed to update banner");
    }

    return {
      data: responseData.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update banner",
    };
  }
}

export async function deleteBanner(id: string): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");

    const response = await fetch(`${config.server}/api/banners/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to delete banner");
    }

    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete banner",
    };
  }
}
