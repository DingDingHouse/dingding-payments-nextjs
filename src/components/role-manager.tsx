'use client';

import { Role } from "@/lib/types";
import { RoleDragAndDrop } from "@/components/role-dnd";
import { useToast } from "@/hooks/use-toast";
import { RoleEditForm } from "./role-edit-form";
import { deleteRole, updateRole } from "@/lib/actions";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function RoleManager({ currentRole, availableRoles }: { currentRole: Role, availableRoles: Role[] }) {
    const { toast } = useToast();
    const router = useRouter();


    const handleUpdateDescendants = async (roleIds: string[], operation: 'add' | 'remove') => {
        const { error, message } = await updateRole(currentRole._id, {
            descendants: roleIds,
            operation
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error
            });
            return;
        }

        toast({
            title: "Success",
            description: message || "Descendants updated successfully"
        });
    };

    const handleDelete = async () => {
        const { error, message } = await deleteRole(currentRole._id);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error
            });
            return;
        }

        toast({
            title: "Success",
            description: message || "Role deleted successfully"
        });

        router.push('/roles');
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold capitalize">{currentRole.name}</h1>
                <div className=" space-x-4">
                    <RoleEditForm role={currentRole} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete Role</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    role and remove it from any associations.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

            </div>
            <RoleDragAndDrop
                currentRole={currentRole}
                availableRoles={availableRoles}
                onUpdateDescendants={handleUpdateDescendants}
            />
        </div>
    );
}