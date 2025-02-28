import { Button } from "@/components/ui/button";
import { UserDetailsCard } from "@/components/user-details-card";
import { UserNavButtons } from "@/components/user-nav-buttons";
import { getUserById } from "@/lib/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const { data, error } = await getUserById(userId);

    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>User not found</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost">
                    <Link href="/users">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Users
                    </Link>
                </Button>
            </div>

            <UserDetailsCard user={data} />
            <UserNavButtons userId={userId} />


            <div className="mt-6">
                {children}
            </div>
        </div>
    )
}
