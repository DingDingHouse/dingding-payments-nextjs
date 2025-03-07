"use client";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "./status-badge";
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Pencil,
  ShieldCheck,
  Trash,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UpdateUserForm } from "./user-update";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPermissions } from "./user-permissions";
import Link from "next/link";
import { UserSearch } from "./user-search";
import { DateRangePicker } from "./date-range-picker";
import { User } from "@/lib/features/users/UsersSlice";

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },

  {
    accessorFn: (row) => row.role.name,
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    accessorFn: (row) => row.createdBy.name,
    header: "Created By",
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) =>
      getValue()
        ? new Date(getValue() as string | number | Date).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )
        : "N/A",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionMenu row={row.original} />,
  },
];

const ActionMenu = ({ row }: { row: User }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteUser(row._id);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      toast({
        title: "Success",
        description: result.message || "User deleted successfully",
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
          <DropdownMenuItem asChild>
            <Link href={`/users/${row._id}`}>
              <UserIcon className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsPermissionsDialogOpen(true)}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Manage Permissions
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
          <UpdateUserForm
            user={row}
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

      {/* Permissions Dialog */}
      <Dialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
          </DialogHeader>
          <UserPermissions
            user={row}
            onUpdate={() => {
              router.refresh();
              setIsPermissionsDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function UsersTable({ data }: { data: User[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const view = searchParams.get("view");
  const sortOrder = searchParams.get("sortOrder");
  const search = searchParams.get("search");

  return (
    <div className="space-y-6">
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <Button asChild variant={!view ? "default" : "outline"}>
            <Link href={pathname}>All downstream</Link>
          </Button>
          <Button asChild variant={view === "created" ? "default" : "outline"}>
            <Link href="?view=created">Created by me</Link>
          </Button>
          <Button asChild variant={view === "others" ? "default" : "outline"}>
            <Link href="?view=others">Created by others</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <UserSearch search={search || ""} />
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

      <DataTable data={data || []} columns={userColumns} />
    </div>
  );
}
