"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Banner, Wallet } from "@/lib/types";
import { updateWallet } from "@/app/(dashboard)/wallets/actions";
import { title } from "process";
import { updateBanner } from "@/app/(dashboard)/banners/actions";

enum WalletStatus {
  Active = "active",
  Inactive = "inactive",
}

interface UpdateBannerFormProps {
  banner: Banner;
  onSuccess: () => void;
}

export function UpdateBannerForm({ banner, onSuccess }: UpdateBannerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: banner.title,
    isActive: banner.isActive,
    image: null as File | null,
  });

  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only include fields that changed
      const form = new FormData();

      if (formData.title !== banner.title) {
        form.append("title", formData.title);
      }

      if (formData.isActive !== banner.isActive) {
        form.append("isActive", formData.isActive ? "true" : "false");
      }

      if (formData.image) {
        form.append("image", formData.image);
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

      const { error } = await updateBanner(banner._id, form);

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
        description: "Banner updated successfully",
      });
      onSuccess();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update banner",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Banner Title"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <Select
        value={formData.isActive ? "true" : "false"}
        onValueChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            isActive: value === "true" ? true : false,
          }))
        }
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
          }
        }}
        required
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Banner"}
      </Button>
    </form>
  );
}
