"use client";

import { useState } from "react";
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
import { useAppSelector } from "@/lib/hooks";
import { createPlatform } from "@/app/(dashboard)/platforms/actions";

export function PlatformForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    image: null as File | null,
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
      form.append("name", formData.name);
      form.append("url", formData.url);
      form.append("image", formData.image);

      const { data, error } = await createPlatform(form);
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
          description: `Platform created successfully`,
        });
        setFormData({
          name: "",
          url: "",
          image: null,
        });
        setOpen(false);
        router.refresh();
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create platform",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Platform</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Platform</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Platform Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <Input
            placeholder="Platform URL"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            required
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
            required
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Platform"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
