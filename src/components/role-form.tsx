'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createRole } from '@/lib/actions';

export function RoleForm() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const { error, message } = await createRole(name);

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
            description: message || "Role created successfully"
        });

        setOpen(false);
        setName('');
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Role</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Role name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}