import { RoleForm } from "@/components/role-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRoles } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function RolesPage() {
  const { data } = await getRoles();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles</h1>
        <RoleForm />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data &&
          data.map((role) => (
            <Link href={`/roles/${role._id}`} key={role._id}>
              <Card key={role._id}>
                <CardHeader>
                  <CardTitle className="capitalize">{role.name}</CardTitle>
                  <CardDescription>Status: {role.status}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
