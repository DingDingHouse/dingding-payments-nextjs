'use client'

declare global {
    interface Window {
        Tawk_API?: any;
        Tawk_LoadStart?: Date;
    }
}

export function TawkInit() {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    return null;
}