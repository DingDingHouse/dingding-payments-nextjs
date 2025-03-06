"use server";

import { config } from "@/lib/config";
import getCookie from "@/lib/getCookie";
import {
  ActionResponse,
  QRCode,
  QRCodeQuery,
  QRCodeResponse,
  WalletQRQuery,
  WalletQuery,
} from "@/lib/types";

export async function getWalletTypes(): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    const response = await fetch(`${config.server}/api/wallets/types`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    const responseData = await response.json();
    if (!response.ok) {
      return {
        data: null,
        error: responseData.error?.message || "Failed to get wallet types",
      };
    }
    return { data: responseData.data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to get wallet types",
    };
  }
}

export async function createWalletType(
  data: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { data: null, error: "No access token found" };
    }

    const response = await fetch(`${config.server}/api/wallets/types`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      credentials: "include",
    });

    const responseData = await response.json();
    if (!response.ok) {
      return {
        data: null,
        error: responseData.error?.message || "Failed to create wallet type",
      };
    }

    return { data: responseData.data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create wallet type",
    };
  }
}

export async function createWallet(
  data: FormData,
  walletTypeId: string
): Promise<ActionResponse<any>> {
  try {
    console.log(data);
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { data: null, error: "No access token found" };
    }

    const response = await fetch(
      `${config.server}/api/wallets/types/${walletTypeId}/wallets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
        credentials: "include",
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      return {
        data: null,
        error: responseData.error?.message || "Failed to create wallet",
      };
    }

    return { data: responseData.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create wallet",
    };
  }
}

export async function getWalletsByType(
  walletTypeId: string,
  query?: WalletQuery
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value.toString());
        }
      });
    }

    const url = new URL(
      `${
        config.server
      }/api/wallets/types/${walletTypeId}/wallets?${params.toString()}`
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "force-cache", // Add caching
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch descendants");
    }

    return {
      data: {
        data: data.data,
        meta: data.meta,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch descendants",
    };
  }
}

export async function getWallets(
  query?: WalletQuery
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value.toString());
        }
      });
    }

    const url = new URL(`${config.server}/api/wallets?${params.toString()}`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "force-cache", // Add caching
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch descendants");
    }

    return {
      data: {
        data: data.data,
        meta: data.meta,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch descendants",
    };
  }
}

export async function getAWallet(
  walletId: string,
  query: WalletQRQuery
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value.toString());
        }
      });
    }

    const url = new URL(
      `${config.server}/api/wallets/${walletId}?${params.toString()}`
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch descendants");
    }

    return {
      data: {
        data: data.data,
        meta: data.meta,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch descendants",
    };
  }
}

export async function updateWallet(
  id: string,
  data: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { data: null, error: "No access token found" };
    }

    const response = await fetch(`${config.server}/api/wallets/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: responseData.error?.message || "Failed to update wallet",
      };
    }

    return { data: responseData.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update wallet",
    };
  }
}

export async function deleteWallet(id: string): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { data: null, error: "No access token found" };
    }

    const response = await fetch(`${config.server}/api/wallets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: responseData.error?.message || "Failed to delete wallet",
      };
    }

    return { data: responseData.data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete wallet",
    };
  }
}

export async function addQR(
  walletId: string,
  formData: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    const url = `${config.server}/api/wallets/${walletId}/qrcodes`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to create QR code");
    }

    return {
      data: data.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create QR code",
    };
  }
}

export async function getQRCodes(
  query: QRCodeQuery
): Promise<ActionResponse<QRCodeResponse>> {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return { data: null, error: "No access token found" };
    }

    // Build query string
    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.status) params.append("status", query.status);
    if (query.search) params.append("search", query.search);
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    const url = `${config.server}/api/wallets/${
      query.walletId
    }/qrcodes?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "force-cache",
      next: {
        revalidate: 30, // Cache for 30 seconds
        tags: [`wallet-${query.walletId}-qrcodes`],
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error:
          result.error?.message ||
          `Failed to fetch QR codes: ${response.status}`,
      };
    }

    return {
      data: result,
      error: null,
      message: result.message,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch QR codes",
    };
  }
}

// Add these functions to your existing actions.ts file
export async function updateQRCode(
  walletId: string,
  qrCodeId: string,
  formData: FormData
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { data: null, error: "No access token found" };
    }

    const response = await fetch(
      `${config.server}/api/wallets/${walletId}/qrcodes/${qrCodeId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
        credentials: "include",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: responseData.error?.message || "Failed to update QR code",
      };
    }

    return { data: responseData.data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to update QR code",
    };
  }
}

export async function deleteQRCode(
  walletId: string,
  qrCodeId: string
): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) {
      return { data: null, error: "No access token found" };
    }

    const response = await fetch(
      `${config.server}/api/wallets/${walletId}/qrcodes/${qrCodeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: responseData.error?.message || "Failed to delete QR code",
      };
    }

    return { data: responseData.data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to delete QR code",
    };
  }
}
