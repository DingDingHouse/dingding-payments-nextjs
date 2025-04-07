import { LucideIcon, Receipt, Users } from "lucide-react";

export enum Roles {
  ROOT = "root",
  PLAYER = "player",
}

export type NavButton = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type RoleViews = {
  [key in Roles]: NavButton[];
};

export const roleViews: RoleViews = {
  [Roles.ROOT]: [
    { label: "Descendants", href: "/users/[userId]/descendants", icon: Users },
    {
      label: "Transactions",
      href: "/users/[userId]/transactions",
      icon: Users,
    },
    { label: "Requests", href: "/users/[userId]/requests", icon: Receipt },
  ],
  [Roles.PLAYER]: [
    {
      label: "Transactions",
      href: "/users/[userId]/transactions",
      icon: Users,
    },
    { label: "Requests", href: "/users/[userId]/requests", icon: Receipt },
  ],
};

export type RolesResponse = {
  success: boolean;
  message: string;
  data: Role[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export type ActionResponse<T> = {
  data: T | null;
  message?: string;
  error: string | null;
};

export type Role = {
  _id: string;
  name: string;
  status: string;
  descendants?: Role[];
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateRolePayload = {
  name?: string;
  status?: string;
  descendants?: string[];
  operation?: "add" | "remove";
};

export interface Permission {
  resource: string;
  permission: string;
}

export type Transaction = {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  receiver: {
    _id: string;
    name: string;
  };
  type: "recharge" | "redeem";
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type Banner = {
  _id: string;
  title: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type Platform = {
  _id: string;
  name: string;
  url: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type Game = {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  url: string;
  type: string;
  category: string;
  status: string;
  tag: string;
  slug: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  payout: string;
};

export type WalletType = {
  _id: string;
  name: string;
  logo: string;
  status: "active" | "inactive";
  createdBy: {
    name: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type Wallet = {
  _id: string;
  name: string;
  logo: string;
  status: "active" | "inactive";
  createdBy: {
    name: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export type FilterParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  view?: string;
  [key: string]: any;
};

export interface UpdateUserPayload {
  username?: string;
  name?: string;
  status?: string;
  role?: string;
  balance?: {
    type: "recharge" | "redeem";
    amount: number;
  };
}

export type UserQuery = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  view?: string;
  role?: string;
  status?: string;
  username?: string;
};

export type TransactionQuery = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  type?: "recharge" | "redeem";
  amount?: number;
  amountOp?: "gt" | "lt" | "eq";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export type BannerQuery = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
  isActive?: "true" | "false";
};

export type GamesQuery = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  tag?: string;
  download?: string;
};

export type WalletQuery = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export type WalletQRQuery = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
};

export interface QRCodeQuery {
  walletId: string;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface QRCode {
  _id: string;
  walletId: string;
  qrcode: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeData {
  _id: string;
  walletId: string;
  title: string;
  qrcode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QRCodeResponse {
  success: boolean;
  message: string;
  data: QRCodeData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Descendant {
  _id: string;
  name: string;
  username: string;
  role: {
    _id: string;
    name: string;
  };
}

export type IBanner = {
  _id: string;
  title: string;
  image: string;
  isActive: boolean;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  __v: number;
};

export interface IPlatform {
  _id: string;
  name: string;
  url: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}