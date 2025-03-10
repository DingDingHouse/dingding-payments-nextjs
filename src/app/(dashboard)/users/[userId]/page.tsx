import { redirect } from "next/navigation";

export default async function UserDetailsPage(props: {
    params: Promise<{ userId: string }>
}) {

    // const params = await props.params;
    // redirect(`/users/${params.userId}/descendants`);
    return null;
}