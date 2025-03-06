import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlowingBackgroundProps {
    children: ReactNode;
    className?: string;
}

export function GlowingBackground({ children, className }: GlowingBackgroundProps) {
    return (
        <div className={cn(
            "relative w-full overflow-hidden",
            className
        )}>
            {/* Animated glowing elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-4000"></div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}