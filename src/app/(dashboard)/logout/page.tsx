'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/lib/hooks';
import { clearUser } from '@/lib/features/users/UsersSlice';

export default function LogoutPage() {
    const router = useRouter();
    const { toast } = useToast();
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function logout() {
            try {

                // End the Tawk.to chat session if available
                if (window.Tawk_API && window.Tawk_API.endChat) {
                    window.Tawk_API.endChat();
                }
                dispatch(clearUser());

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

                window.location.href = '/login';  // ✅ Forces a full page reload
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