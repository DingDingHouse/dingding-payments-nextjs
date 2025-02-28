'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LogoutPage() {
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function logout() {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Logout failed');
                }

                toast({
                    title: 'Success',
                    description: data.message
                });

                router.push('/login');
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to logout'
                });
                router.push('/');
            }
        }

        logout();
    }, [router, toast]);

    return null;
}