"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addQR } from "@/app/(dashboard)/wallets/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddQRButtonProps {
  walletId: string;
}

export function AddQRButton({ walletId }: AddQRButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(formData: FormData) {
    setLoading(true);

    try {
      const result = await addQR(walletId, formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "QR code created successfully",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create QR code",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add QR Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New QR Code</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit(formData);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          {/* select field for status active or inactive */}
          {/* <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              className="block w-full mt-1 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm border-gray-300"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}
          <div>
            <Label htmlFor="qrcode">QR Code Image</Label>
            <Input
              id="qrcode"
              name="qrcode"
              type="file"
              accept="image/*"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create QR Code"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
