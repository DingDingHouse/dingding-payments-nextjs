import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { whoIam } from "@/lib/actions"
import { redirect } from "next/navigation";
import StoreProvider from "../StoreProvider";
import Script from "next/script";
import { TawkInit } from "@/components/tawk-init";

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
            <TawkInit />
            <Script
                id="tawk-script"
                src="https://embed.tawk.to/67c6df32b5d977190f13cebf/1ilgdfnm9"
                strategy="afterInteractive"
                crossOrigin="anonymous"
            />
        </StoreProvider>

    )
}

