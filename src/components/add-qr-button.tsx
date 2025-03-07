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
import { on } from "events";

interface AddQRButtonProps {
  walletId: string;
}

export function AddQRButton({ walletId }: AddQRButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    status: "active",
    qrcode: null as File | null,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("button clicked");
    setLoading(true);

    try {
      if (!formData.qrcode) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "qrcode is required",
        });
        return;
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("status", formData.status);
      form.append("qrcode", formData.qrcode);
      const result = await addQR(walletId, form);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        toast({
          title: "Success",
          description: `QR code created successfully`,
        });
        setFormData({
          title: "",
          status: "active",
          qrcode: null,
        });
        setOpen(false);
        router.refresh();
      }
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
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <Select
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
            <Label htmlFor="qrcode">QR Code Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, qrcode: file }));
                }
              }}
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
