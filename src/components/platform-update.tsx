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
import { Banner, Platform, Wallet } from "@/lib/types";
import { updateWallet } from "@/app/(dashboard)/wallets/actions";
import { title } from "process";
import { updateBanner } from "@/app/(dashboard)/banners/actions";
import { updatePlatform } from "@/app/(dashboard)/platforms/actions";

interface UpdatePlatformFormProps {
  platform: Platform;
  onSuccess: () => void;
}

export function UpdatePlatformForm({
  platform,
  onSuccess,
}: UpdatePlatformFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: platform.name,
    url: platform.url,
    image: null as File | null,
  });

  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Only include fields that changed
      const form = new FormData();

      if (formData.name !== platform.name) {
        form.append("name", formData.name);
      }

      if (formData.url !== platform.url) {
        form.append("url", formData.url);
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

      const { error } = await updatePlatform(platform._id, form);

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
        description: "Platform updated successfully",
      });
      onSuccess();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update platform",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Platform Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      <Input
        placeholder="Platform URL"
        value={formData.url}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, url: e.target.value }))
        }
      />

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
          }
        }}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Platform"}
      </Button>
    </form>
  );
}
