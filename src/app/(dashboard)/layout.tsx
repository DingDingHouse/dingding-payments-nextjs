import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { whoIam } from "@/lib/actions"
import { redirect } from "next/navigation";
import StoreProvider from "../StoreProvider";
import { TawkInit } from "@/components/tawk-init";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const { data, error } = await whoIam();
    if (error) {
        redirect('/logout')
    }
    console.log("WHO IAM  : ", data)
    return (
        <StoreProvider initialData={data}>
            <SidebarProvider>
                <AppSidebar user={data} />
                <main className="w-full">
                    {children}
                </main>
            </SidebarProvider>
            <TawkInit />
        </StoreProvider>

    )
}

