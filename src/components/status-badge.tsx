import { cn } from "@/lib/utils";

type ShadcnVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "warning" | "success";
type BadgeVariant = 'status' | 'transaction' | ShadcnVariant;

interface StatusBadgeProps {
    status: string;
    variant?: BadgeVariant;
    className?: string;
}

const StatusBadge = ({ status, variant = 'status', className }: StatusBadgeProps) => {
    const getStatusStyles = (status: string, variant: BadgeVariant) => {
        // Handle shadcn variants
        if (
            ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'warning', 'success'].includes(variant as string)
        ) {
            const variantClasses = {
                default: "bg-primary text-primary-foreground border-transparent",
                destructive: "bg-red-100 text-red-800 border-red-200",
                outline: "border-input bg-background text-foreground",
                secondary: "bg-secondary text-secondary-foreground border-transparent",
                ghost: "bg-transparent border-transparent",
                link: "text-primary underline-offset-4 hover:underline bg-transparent border-transparent",
                warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
                success: "bg-green-100 text-green-800 border-green-200"
            };

            return variantClasses[variant as ShadcnVariant];
        }

        // Handle existing transaction variant
        if (variant === 'transaction') {
            switch (status.toLowerCase()) {
                case "deposit":
                    return "bg-emerald-100 text-emerald-800 border-emerald-200";
                case "withdrawal":
                    return "bg-rose-100 text-rose-800 border-rose-200";
                default:
                    return "bg-blue-100 text-blue-800 border-blue-200";
            }
        }

        // Handle existing status variant (default)
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200";
            case "inactive":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "blocked":
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "approved":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    const baseClasses = "px-2 py-1 text-sm font-medium rounded-full border";

    return (
        <span className={cn(baseClasses, getStatusStyles(status, variant), className)}>
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </span>
    );
};

export default StatusBadge;