"use client";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Banner } from "@/lib/types";
import { debounce, formatCurrency } from "@/lib/utils";
import StatusBadge from "./status-badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { DateRangePicker } from "./date-range-picker";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useCallback } from "react";

const BannerColumns: ColumnDef<Banner>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "url",
    header: "Url",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      return <StatusBadge status={`${row.original.isActive}`} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center">
        {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    ),
  },
  //   {
  //     id: "actions",
  //     header: "Actions",
  //     cell: ({ row }) => <ActionMenu row={row.original} />,
  //   },
];

const BannerTable = ({ data }: { data: Banner[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get("type");
  const sortOrder = searchParams.get("sortOrder");
  const search = searchParams.get("search");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`?${params.toString()}`);
    }, 500),
    [searchParams, router]
  );
  return (
    <div className="space-y-6">
      {/* <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <Button asChild variant={!type ? "default" : "outline"}>
            <Link href={pathname}>All Transactions</Link>
          </Button>
          <Button asChild variant={type === "recharge" ? "default" : "outline"}>
            <Link href="?type=recharge">Recharge</Link>
          </Button>
          <Button asChild variant={type === "redeem" ? "default" : "outline"}>
            <Link href="?type=redeem">Redeem</Link>
          </Button>
        </div>
      </div> */}

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Input
          placeholder="Search transactions..."
          defaultValue={search || ""}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
          <DateRangePicker />
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant={sortOrder === "desc" ? "default" : "outline"}
              size="sm"
            >
              <Link
                href={{
                  pathname,
                  query: {
                    ...Object.fromEntries(searchParams.entries()),
                    sortBy: "createdAt",
                    sortOrder: "desc",
                  },
                }}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Latest
              </Link>
            </Button>
            <Button
              asChild
              variant={sortOrder === "asc" ? "default" : "outline"}
              size="sm"
            >
              <Link
                href={{
                  pathname,
                  query: {
                    ...Object.fromEntries(searchParams.entries()),
                    sortBy: "createdAt",
                    sortOrder: "asc",
                  },
                }}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Oldest
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <DataTable data={data || []} columns={BannerColumns} />
    </div>
  );
};

export default BannerTable;
