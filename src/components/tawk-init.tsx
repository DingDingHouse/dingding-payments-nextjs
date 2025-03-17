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
    sendMessage: (message: string) => void;
}

declare global {
    interface Window {
        Tawk_API?: TawkAPI;
        Tawk_LoadStart: Date;
    }
}

export function TawkInit() {
    const currentUser = useAppSelector((state) => state.users.currentUser);

    useEffect(() => {

        // Skip initialization if user doesn't meet criteria
        if (!currentUser || currentUser.role.name !== Roles.PLAYER) {
            return;
        }

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
                },
                sendMessage: (message: string) => { }
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
                        console.log('Error setting Tawk attributes:', error);
                    }
                });

                // Make sure widget is shown when reloaded
                window.Tawk_API?.showWidget();
            }
        };

        // Cleanup function when component unmounts
        return () => {
            if (window.Tawk_API) {
                window.Tawk_API.hideWidget(); // Hide chat widget
                window.Tawk_API.endChat?.(); // End chat session if method exists
            }
        };
    }, [currentUser]);

    if (!currentUser || currentUser.role.name !== Roles.PLAYER) {
        return null;
    }

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