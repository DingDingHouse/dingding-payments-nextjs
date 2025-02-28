import { RoleManager } from "@/components/role-manager";
import { getRole, getRoles } from "@/lib/actions";

type Props = {
    params: {
        roleId: string
    }
}

export default async function SingleRolePage({ params }: Props) {
    const { roleId } = await params;
    const { data: currentRole, error } = await getRole(roleId);
    const { data: availableRoles } = await getRoles();


    if (error) {
        return <div>Error: {error}</div>
    }
    if (!currentRole) {
        return <div>Loading...</div>
    }

    if (!availableRoles) {
        return <div>Loading...</div>
    }
    return (
        <RoleManager currentRole={currentRole} availableRoles={availableRoles} />
    )

}