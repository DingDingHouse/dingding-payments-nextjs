import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { updateUserPermissions } from "@/lib/actions";
import { Permission } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { User } from "@/lib/features/users/UsersSlice";

const RESOURCES = ['users', 'roles', 'wallets', 'requests','banners','platforms'];
const PERMISSIONS = ['r', 'w', 'x'];

export function UserPermissions({ user, onUpdate }: { user: User; onUpdate: () => void }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [permissions, setPermissions] = useState<Permission[]>(user.permissions);
    const [localPermissions, setLocalPermissions] = useState<Permission[]>(user.permissions);

    const filteredResources = RESOURCES.filter(resource =>
        resource.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePermissionToggle = (resource: string, perm: string, enabled: boolean) => {
        setLocalPermissions(prev => {
            const currentPermission = prev.find(p => p.resource === resource)?.permission || '---';
            const newPermission = PERMISSIONS.map(p =>
                p === perm ? (enabled ? p : '-') :
                    currentPermission[PERMISSIONS.indexOf(p)]
            ).join('');

            return prev.map(p =>
                p.resource === resource
                    ? { ...p, permission: newPermission }
                    : p
            );
        });
    };

    const handleSubmit = async () => {
        try {
            const addPermissions: Permission[] = [];
            const removePermissions: Permission[] = [];

            localPermissions.forEach(curr => {
                const original = permissions.find(p => p.resource === curr.resource);
                if (original?.permission !== curr.permission) {
                    PERMISSIONS.forEach((perm, index) => {
                        const hadPerm = original?.permission?.[index] === perm;
                        const hasPerm = curr.permission[index] === perm;

                        if (!hadPerm && hasPerm) {
                            addPermissions.push({
                                resource: curr.resource,
                                permission: PERMISSIONS.map((p, i) =>
                                    i === index ? perm : '-'
                                ).join('')
                            });
                        } else if (hadPerm && !hasPerm) {
                            removePermissions.push({
                                resource: curr.resource,
                                permission: PERMISSIONS.map((p, i) =>
                                    i === index ? perm : '-'
                                ).join('')
                            });
                        }
                    });
                }
            });

            if (addPermissions.length === 0 && removePermissions.length === 0) {
                return;
            }

            const results = await Promise.all([
                addPermissions.length > 0 && updateUserPermissions(user._id, {
                    permissions: addPermissions,
                    operation: 'add'
                }),
                removePermissions.length > 0 && updateUserPermissions(user._id, {
                    permissions: removePermissions,
                    operation: 'remove'
                })
            ].filter(Boolean));

            const error = results.find(r => r && 'error' in r && r.error);
            if (error) {
                throw new Error(error.error ?? "Unknown error");
            }

            const lastResult = results[results.length - 1];
            if (lastResult && lastResult.data) {
                setPermissions(lastResult.data.permissions);
            }
            onUpdate();
            toast({
                title: "Success",
                description: "Permissions updated successfully"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update permissions"
            });
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <Card className="p-4 sm:p-6">
                <div className="space-y-4">
                    <Input
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4"
                    />
                    <ScrollArea className="h-[calc(100vh-300px)] sm:h-[500px] pr-2 sm:pr-4">
                        <div className="space-y-4 sm:space-y-6">
                            {filteredResources.map((resource) => (
                                <div key={resource} className="border rounded-lg p-4 sm:p-6">
                                    <Label className="text-base sm:text-lg font-medium capitalize block mb-4">
                                        {resource}
                                    </Label>
                                    <div className="space-y-3 sm:space-y-4">
                                        {[
                                            { perm: 'r', label: 'View', description: 'Can view records' },
                                            { perm: 'w', label: 'Edit', description: 'Can create and modify records' },
                                            { perm: 'x', label: 'Delete', description: 'Can delete records' }
                                        ].map(({ perm, label, description }) => {
                                            const currentPermission = localPermissions.find(
                                                p => p.resource === resource
                                            )?.permission || '---';
                                            return (
                                                <div key={perm} className="flex items-start sm:items-center gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-muted/50 rounded-lg">
                                                    <Switch
                                                        id={`${resource}-${perm}`}
                                                        checked={currentPermission.includes(perm)}
                                                        onCheckedChange={(checked) =>
                                                            handlePermissionToggle(resource, perm, checked)
                                                        }
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <Label htmlFor={`${resource}-${perm}`} className="text-sm sm:text-base">
                                                            {label}
                                                        </Label>
                                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                            {description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </Card>
            <div className="flex justify-end px-4 sm:px-0">
                <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
            </div>
        </form>
    );
}