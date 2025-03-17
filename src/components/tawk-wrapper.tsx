"use client"

import React from 'react'

interface TawkWrapperProps {
    children: React.ReactNode;
    onClick?: () => void; // Optional additional onClick handler
    className?: string;
    action?: 'toggle' | 'maximize' | 'minimize'; // Add action type
}

export const TawkWrapper = ({
    children,
    onClick,
    action = 'toggle', // Default to toggle behavior
    ...rest
}: TawkWrapperProps) => {

    const handleClick = (e: React.MouseEvent) => {
        // First execute Tawk functionality
        if (typeof window !== "undefined" && window.Tawk_API) {
            try {
                // Use the specified action (toggle, maximize, or minimize)
                if (action === 'toggle') {
                    window.Tawk_API.toggle();
                } else if (action === 'maximize') {
                    window.Tawk_API.maximize();
                } else if (action === 'minimize') {
                    window.Tawk_API.minimize();
                }
            } catch (error) {
                console.log("Error with Tawk chat:", error);
            }
        }

        // Then execute any additional onClick handler if provided
        if (onClick) {
            onClick();
        }
    };


    // Clone the child element and add the onClick handler
    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                onClick: handleClick,
                ...rest
            });
        }
        return child;
    });

    return <>{enhancedChildren}</>;
};