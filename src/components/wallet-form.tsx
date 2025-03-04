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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createWallet } from '@/actions/wallets';
import { useAppSelector } from '@/lib/hooks';
import { Descendant, Roles } from '@/lib/types';
import { getDescendants } from '@/lib/actions';

export function WalletForm() {

    const user = useAppSelector(state => state.users.currentUser);
    const isRoot = user?.role.name === Roles.ROOT;
    const [descendants, setDescendants] = useState<Descendant[]>([]);


    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        status: 'active',
        logo: null as File | null,
        referenceUserId: ''
    });

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (isRoot) {
            const fetchDescendants = async () => {
                const { data, error } = await getDescendants({ role: 'admin' });
                if (!error && data) {
                    setDescendants(data.data);
                }
            };
            fetchDescendants();
        }
    }, [isRoot]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.logo) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Logo is required"
                });
                return;
            }

            const form = new FormData();
            form.append('name', formData.name);
            form.append('status', formData.status);
            form.append('logo', formData.logo);

            if (isRoot && formData.referenceUserId) {
                form.append('referenceUserId', formData.referenceUserId);
            }

            const { data, error } = await createWallet(form);
            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error
                });
                return;
            }

            if (data) {
                toast({
                    title: "Success",
                    description: `Wallet "${data.name}" created successfully`
                });
                setFormData({ name: '', status: 'active', logo: null, referenceUserId: '' });
                setOpen(false);
                router.refresh();
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create wallet"
            });
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Wallet</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Wallet</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Wallet Name"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />

                    {isRoot && (
                        <Select
                            value={formData.referenceUserId}
                            onValueChange={(value) => setFormData(prev => ({
                                ...prev,
                                referenceUserId: value
                            }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Reference User" />
                            </SelectTrigger>
                            <SelectContent>
                                {descendants.map((descendant) => (
                                    <SelectItem
                                        key={descendant._id}
                                        value={descendant._id}
                                    >
                                        {descendant.name} ({descendant.username})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
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

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setFormData(prev => ({ ...prev, logo: file }));
                            }
                        }}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Wallet"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}