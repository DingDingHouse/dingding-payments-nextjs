import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { whoIam } from "@/lib/actions"
import { redirect } from "next/navigation";
import StoreProvider from "../StoreProvider";
import { UserProvider } from "@/components/user-provider";


export default async function Layout({ children }: { children: React.ReactNode }) {
    const { data, error } = await whoIam();
    if (error) {
        redirect('/logout')
    }
    return (
        <StoreProvider>
            <SidebarProvider>
                <UserProvider initialUser={data} />
                <main className="w-full">
                    {children}
                </main>
            </SidebarProvider>
        </StoreProvider>

    )
}
