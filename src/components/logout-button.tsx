"use client"

import { clearUser } from "@/lib/features/users/UsersSlice";
import { useAppDispatch } from "@/lib/hooks";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface LogoutButtonProps {
    className?: string;
}

export const LogoutButton = ({ className }: LogoutButtonProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = useCallback(async () => {
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);

            // Call the logout API endpoint
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                console.error('Logout failed:', response.statusText);
            }

            // Redirect to login page regardless of success/failure
            router.push('/login');

        } catch (error) {
            console.error('Error during logout:', error);
            setIsLoggingOut(false);


            router.push('/login');
        }
    }, [dispatch, isLoggingOut, router]);

    return (
        <div className={`block w-full ${className}`}>
            <div
                onClick={handleLogout}
                className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-red-500/30 rounded-xl p-4 shadow-lg hover:border-red-500/60 transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg">
                        <LogOut className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </p>
                        <p className="text-[#8EACCD] text-xs">End session</p>
                    </div>
                </div>
            </div>
        </div>
    );
};