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
            // Clear Redux state immediately
            dispatch(clearUser());

            try {
                // End the Tawk.to chat session if available
                if (typeof window !== 'undefined' && window.Tawk_API && window.Tawk_API.endChat) {
                    window.Tawk_API.endChat();
                }

                // Clear client-side state before making the request
                localStorage.removeItem('persist:root');
                sessionStorage.clear();

                // Make logout request to clear cookies
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });

                // Process response
                const data = await response.json().catch(() => ({ message: 'Logged out' }));

                toast({
                    title: 'Success',
                    description: data.message || 'Successfully logged out'
                });
            } catch (error) {
                // Show error toast but don't prevent redirect
                toast({
                    variant: 'destructive',
                    title: 'Warning',
                    description: 'Logout completed with some errors'
                });
            } finally {
                // Always redirect to login page with full page reload
                // This ensures all React contexts and states are fully reset
                router.push('/login');
            }
        }

        logout();
    }, [dispatch, toast]);

    // Show a simple loading message while logging out
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-muted-foreground">Logging out...</p>
        </div>
    );
}