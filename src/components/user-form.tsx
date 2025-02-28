'use client';

import { useEffect, useState } from 'react';
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
import { getRoles, registerUser } from '@/lib/actions';
import { Role } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function UserForm() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        status: 'active',
        roleId: ''
    });
    const [roles, setRoles] = useState<Role[]>([]);

    const { toast } = useToast();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const { error } = await registerUser(formData);

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
            description: "User created successfully"
        });
        setOpen(false);
        router.refresh();
    }

    useEffect(() => {
        async function fetchRoles() {
            const { data, error } = await getRoles();
            if (data) {
                setRoles(data);
            }

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error
                });
                return;
            }
        }
        fetchRoles();
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Name"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />
                    <Input
                        placeholder="Username"
                        value={formData.username}
                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                    />

                    <Select
                        value={formData.roleId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(role => (
                                <SelectItem key={role._id} value={role._id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}