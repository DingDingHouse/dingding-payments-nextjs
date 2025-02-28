import { RoleManager } from "@/components/role-manager";
import { getRole, getRoles } from "@/lib/actions";

export default async function SingleRolePage(props: {
    params: Promise<{ roleId: string }>
}) {
    const params = await props.params;
    const { data: currentRole, error } = await getRole(params.roleId);
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