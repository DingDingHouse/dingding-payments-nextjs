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
                <div className="space-y-1">
                    <div className="text-sm font-medium">Role</div>
                    <div className="text-sm text-muted-foreground">{user.role.name}</div>
                </div>

                {/* <div className="space-y-1">
                    <div className="text-sm font-medium">Created By</div>
                    <div className="text-sm text-muted-foreground">{user.createdBy.name}</div>
                </div> */}
                {/* <div className="space-y-1">
                    <div className="text-sm font-medium">Created At</div>
                    <div className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                    </div>
                </div> */}
            </CardContent>
        </Card>
    )
}