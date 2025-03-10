"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import StatusBadge from "./status-badge"
import { formatDate } from "@/lib/utils"
import { User } from "@/lib/features/users/UsersSlice"

export function UserDetailsCard({ user }: { user: User }) {
    return (
        <Card>
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <StatusBadge status={user.status} />
                </div>
                <div className="text-sm text-muted-foreground">@{user.username}</div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {/* User ID */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">User ID</div>
                    <div className="text-sm text-muted-foreground truncate">{user._id}</div>
                </div>

                {/* Role */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">Role</div>
                    <div className="text-sm text-muted-foreground">{user.role.name}</div>
                </div>

                {/* Credits */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">Credits</div>
                    <div className={`text-sm font-medium ${user.credits >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${user.credits.toFixed(2)}
                    </div>
                </div>

                {/* Created By */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">Created By</div>
                    <div className="text-sm text-muted-foreground">{user.createdBy?.name || 'N/A'}</div>
                </div>

                {/* Created At */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">Created At</div>
                    <div className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                    </div>
                </div>

                {/* Updated At */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">Last Updated</div>
                    <div className="text-sm text-muted-foreground">
                        {formatDate(user.updatedAt)}
                    </div>
                </div>

                {/* Last Login (if available) */}
                <div className="space-y-1">
                    <div className="text-sm font-medium">Last Login</div>
                    <div className="text-sm text-muted-foreground">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never logged in'}
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}