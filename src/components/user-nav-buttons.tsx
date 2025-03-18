"use client"

import { Button } from "@/components/ui/button"
import { NavButton, Roles, roleViews } from "@/lib/types"
import Link from "next/link"
import { usePathname } from "next/navigation"


export function UserNavButtonsClient({ userId, role }: { userId: string, role: Roles }) {
    const pathname = usePathname()

    const views = role === Roles.PLAYER ? roleViews[Roles.PLAYER] : roleViews[Roles.ROOT];
    const navButtons: NavButton[] = views.map(button => ({
        ...button,
        href: button.href.replace('[userId]', userId)
    }));

    return (
        <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
                {navButtons.map((button) => {
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