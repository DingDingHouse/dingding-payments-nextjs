'use client';

import { useState } from 'react';
import { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateRole } from '@/lib/actions';

export function RoleEditForm({ role }: { role: Role }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(role.name);
    const [status, setStatus] = useState(role.status);
    const { toast } = useToast();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const { error } = await updateRole(role._id, { name, status });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error
            });
            return;
        }

        toast({
            title: "Success",
            description: "Role updated successfully"
        });

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Role</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Role name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit">Update</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}