"use client"

import { Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react'

declare global {
    interface Window {
        Tawk_API?: {
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
        };
    }
}

const SupportButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        // Check if chat is already maximized when component mounts
        if (typeof window !== "undefined" && window.Tawk_API) {
            // Add a small delay to ensure Tawk API is fully initialized
            const timer = setTimeout(() => {
                try {
                    // Check if the chat is already maximized
                    if (window.Tawk_API?.isChatMaximized && window.Tawk_API.isChatMaximized()) {
                        setIsChatOpen(true);
                    }

                    // Set up event listeners for chat state changes
                    if (window.Tawk_API?.onChatMaximized) {
                        window.Tawk_API.onChatMaximized(() => setIsChatOpen(true));
                    }

                    if (window.Tawk_API?.onChatMinimized) {
                        window.Tawk_API?.onChatMinimized(() => setIsChatOpen(false));
                    }
                } catch (error) {
                    console.error("Tawk API error:", error);
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const toggleTawkChat = () => {
        if (typeof window !== "undefined" && window.Tawk_API) {
            try {
                // Toggle chat window
                window.Tawk_API.toggle();

                // Update state based on current status (if API allows)
                if (window.Tawk_API.isChatMaximized && window.Tawk_API.isChatMaximized()) {
                    setIsChatOpen(!isChatOpen);
                }

                return true;
            } catch (error) {
                console.error("Error toggling Tawk chat:", error);
            }
        }
        return false;
    }

    return (
        <div
            onClick={toggleTawkChat}
            className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-xl p-4 shadow-lg hover:border-[#2C73D2]/60 transform transition hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(44,115,210,0.3)] h-full cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-[#4FB286] to-[#2C73D2] rounded-full shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="font-semibold text-white">Support</p>
                    <p className="text-[#8EACCD] text-xs">Get help</p>
                </div>
            </div>
        </div>
    )
}

export default SupportButton