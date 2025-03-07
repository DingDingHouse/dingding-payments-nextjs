"use client";

import { useAppSelector } from "@/lib/hooks";
import { Roles } from "@/lib/types";
import Script from "next/script";
import { useEffect } from "react";

interface TawkAttributes {
    id: string;
    name: string;
    username: string;
    role: string;
}

interface TawkAPI {
    maximize: () => void;
    minimize: () => void;
    toggle: () => void;
    popup: () => void;
    showWidget: () => void;
    hideWidget: () => void;
    isChatMaximized: () => boolean;
    onChatMaximized: (callback: () => void) => void;
    onChatMinimized: (callback: () => void) => void;
    getStatus: () => string;
    endChat?: () => void;
    login: (email: string) => void;
    setAttributes: (attributes: TawkAttributes, callback?: (error?: any) => void) => void;
    onLoad: () => void;
    visitor: {
        name?: string;
        username?: string;
    };
}

declare global {
    interface Window {
        Tawk_API?: TawkAPI;
        Tawk_LoadStart: Date;
    }
}

export function TawkInit() {
    const currentUser = useAppSelector((state) => state.users.currentUser);

    if (!currentUser || currentUser.role.name !== Roles.PLAYER) {
        return null;
    }

    useEffect(() => {
        // Ensure Tawk.to is initialized
        window.Tawk_LoadStart = new Date();

        // Reset Tawk_API if it was deleted during unmounting
        if (!window.Tawk_API) {
            window.Tawk_API = {
                maximize: () => { },
                minimize: () => { },
                toggle: () => { },
                popup: () => { },
                showWidget: () => { },
                hideWidget: () => { },
                isChatMaximized: () => false,
                onChatMaximized: (callback: () => void) => { },
                onChatMinimized: (callback: () => void) => { },
                getStatus: () => "",
                endChat: () => { },
                login: (email: string) => { },
                setAttributes: (attributes: Record<string, any>, callback?: () => void) => { },
                onLoad: () => { },
                visitor: {
                    name: "",
                    username: ""
                }
            };
        }

        // Set visitor information
        window.Tawk_API.visitor = {
            name: currentUser.name,
            username: currentUser.username
        };

        window.Tawk_API.onLoad = function () {
            if (currentUser?.username) {
                window.Tawk_API?.setAttributes({
                    id: currentUser._id,
                    name: currentUser.name,
                    username: currentUser.username,
                    role: currentUser.role.name
                }, function (error?: any) {
                    if (error) {
                        console.error('Error setting Tawk attributes:', error);
                    }
                });

                // Make sure widget is shown when reloaded
                window.Tawk_API?.showWidget();
                console.log("User logged into Tawk chat:", currentUser.name);
            }
        };

        // Cleanup function when component unmounts
        return () => {
            if (window.Tawk_API) {
                console.log("Ending Tawk.to chat session...");
                window.Tawk_API.hideWidget(); // Hide chat widget
                window.Tawk_API.endChat?.(); // End chat session if method exists

                // Don't delete the API object, just clean up the session
                // This allows the widget to reinitialize properly on remount
                // delete window.Tawk_API;
            }
        };
    }, [currentUser]);

    return (
        <Script
            src="https://embed.tawk.to/67c6df32b5d977190f13cebf/1ilgdfnm9"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            // Add key to force script reload when component remounts
            key={`tawk-widget-${currentUser._id}`}
        />
    );
}