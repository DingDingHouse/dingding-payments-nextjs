"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { WalletType } from "@/lib/types";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateWalletType } from "@/app/(dashboard)/wallets/actions";

enum WalletStatus {
  Active = "active",
  Inactive = "inactive",
}

interface UpdateWalletTypeFormProps {
  walletType: WalletType;
  onSuccess: () => void;
}

export function UpdateWalletTypeForm({
  walletType,
  onSuccess,
}: UpdateWalletTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: walletType.name,
    status: walletType.status,
    logo: null as File | null,
  });

  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only include fields that changed
      const form = new FormData();

      if (formData.name !== walletType.name) {
        form.append("name", formData.name);
      }

      if (formData.status !== walletType.status) {
        form.append("status", formData.status);
      }

      if (formData.logo) {
        form.append("logo", formData.logo);
      }

      // Check if any fields were changed
      if (form.entries().next().done) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No changes made",
        });
        return;
      }

      const { error } = await updateWalletType(walletType._id, form);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        return;
      }

      toast({
        title: "Success",
        description: "Wallet updated successfully",
      });
      onSuccess();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wallet",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Wallet Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      <Select
        value={formData.status}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, status: value as WalletStatus }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFormData((prev) => ({ ...prev, logo: file }));
          }
        }}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Wallet"}
      </Button>
    </form>
  );
}
