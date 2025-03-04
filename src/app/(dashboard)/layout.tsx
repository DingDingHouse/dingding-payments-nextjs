import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { whoIam } from "@/lib/actions"
import { redirect } from "next/navigation";
import StoreProvider from "../StoreProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const { data, error } = await whoIam();
    if (error) {
        redirect('/logout')
    }
    console.log(data)
    return (
        <StoreProvider initialData={data}>
            <SidebarProvider>
                <AppSidebar user={data} />
                <main className="w-full">
                    {children}
                </main>
            </SidebarProvider>
        </StoreProvider>

    )
}
