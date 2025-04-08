"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppSelector } from "@/lib/hooks";
import { Descendant, Roles } from "@/lib/types";
import { createBanner } from "@/app/(dashboard)/banners/actions";

export function BannerForm() {
  const user = useAppSelector((state) => state.users.currentUser);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
    isActive: true,
  });

  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.image) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Image is required",
        });
        return;
      }

      const form = new FormData();
      form.append("title", formData.name);
      form.append("image", formData.image);
      form.append("isActive", formData.isActive.toString());

      const { data, error } = await createBanner(form);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        return;
      }

      if (data) {
        toast({
          title: "Success",
          description: `Banner created successfully`,
        });
        setFormData({
          name: "",
          isActive: true,
          image: null,
        });
        setOpen(false);
        router.refresh();
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create banner",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Banner</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Banner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Banner Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />


          <div className="flex flex-col gap-1">
            <label htmlFor="isActive" className="text-sm font-medium text-white">
              Banner Status
            </label>
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
              <SelectTrigger id="isActive">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>


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
            {isLoading ? "Creating..." : "Create Banner "}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
