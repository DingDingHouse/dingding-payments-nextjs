"use client";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Banner, Platform, Wallet } from "@/lib/types";
import { debounce, formatCurrency } from "@/lib/utils";
import StatusBadge from "./status-badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { DateRangePicker } from "./date-range-picker";
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Pencil,
  QrCodeIcon,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { deleteWallet } from "@/app/(dashboard)/wallets/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog";
import { UpdateWalletForm } from "./wallet-update";
import { deleteBanner } from "@/app/(dashboard)/banners/actions";
import { UpdateBannerForm } from "./banner-update";
import { deletePlatform } from "@/app/(dashboard)/platforms/actions";
import { UpdatePlatformForm } from "./platform-update";

const PlatformColumns: ColumnDef<Platform>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ getValue }) => (
      <Image
        src={getValue() as string}
        alt="Platform Image"
        width={48}
        height={48}
        className=" object-cover"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "url",
    header: "Url",
    cell: ({ row }) => (
      <div className="flex items-center hover:underline">
        <a
          href={row.getValue("url")}
          target="_blank"
          rel="noopener noreferrer"
          className=""
        >
          {row.getValue("url")}
        </a>
      </div>
    ),
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionMenu row={row.original} />,
  },
];

const ActionMenu = ({ row }: { row: Platform }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deletePlatform(row._id);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      toast({
        title: "Success",
        description: result.message || "Platform deleted successfully",
      });
      // Refresh the table data
      router.refresh();
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
          </DialogHeader>
          <UpdatePlatformForm
            platform={row}
            onSuccess={() => {
              setIsUpdateDialogOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dailog  */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-[425px] w-[95vw]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const BannerTable = ({ data }: { data: Platform[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <Input
          placeholder="Search Platforms..."
          defaultValue={search || ""}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <DataTable data={data || []} columns={PlatformColumns} />
    </div>
  );
};

export default BannerTable;
