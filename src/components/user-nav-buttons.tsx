"use client"

import { Button } from "@/components/ui/button"
import { Roles } from "@/lib/types"
import { LucideIcon, Receipt, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavButton = {
    label: string;
    href: string;
    icon: LucideIcon;
    playerVisible?: boolean;
}

export function UserNavButtonsClient({ userId, role }: { userId: string, role: string }) {
    const pathname = usePathname()
    const isPlayer = role === Roles.PLAYER

    // Define all possible navigation buttons
    const navButtons: NavButton[] = [
        {
            label: "Descendants",
            href: `/users/${userId}/descendants`,
            icon: Users,
            playerVisible: false, // Not visible to players
        },
        {
            label: "Requests",
            href: `/users/${userId}/requests`,
            icon: Receipt,
            playerVisible: true, // Visible to all including players
        },
    ]

    // Show only "Requests" for players, show all buttons for other roles
    const visibleButtons = isPlayer
        ? navButtons.filter(button => button.playerVisible)
        : navButtons

    return (
        <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
                {visibleButtons.map((button) => {
                    const isActive = pathname.includes(button.href)
                    const Icon = button.icon

                    return (
                        <Button
                            key={button.href}
                            asChild
                            variant={isActive ? 'default' : 'outline'}
                        >
                            <Link href={button.href}>
                                <Icon className="h-4 w-4 mr-2" />
                                {button.label}
                            </Link>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}