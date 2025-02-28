import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { whoIam } from "@/lib/actions"
import { redirect } from "next/navigation";


export default async function Layout({ children }: { children: React.ReactNode }) {
    const { data, error } = await whoIam();
    if (error) {
        redirect('/logout')
    }
    return (
        <SidebarProvider>
            <AppSidebar user={data} />
            <main className=" w-full">
                {/* <SidebarTrigger /> */}
                {children}
            </main>
        </SidebarProvider>

    )
}
