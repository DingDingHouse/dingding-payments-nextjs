import getCookie from "@/lib/getCookie";
import { BannerQuery, Roles } from "@/lib/types";
import { decodeToken } from "@/lib/utils";
import { getAllPlatforms } from "./actions";
import BackToHome from "@/components/back-to-home";
import BannerTable from "@/components/banner-table";
import { PlatformForm } from "@/components/platform-form";
import PlatformTable from "@/components/platform-table";

export const dynamic = "force-dynamic";

export default async function PlatformPage(props: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {

  const searchParams = await props.searchParams;

  const filters: BannerQuery = {
    search: searchParams?.search,
  };
  const cookie = await getCookie("accessToken");
  const decodedToken = cookie ? decodeToken(cookie) : null;
  const isPlayer = decodedToken?.role === Roles.PLAYER;

  const { data } = await getAllPlatforms(filters);

  return (
    <div className="p-4 sm:p-10">
      <BackToHome isPlayer={isPlayer} />

      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <PlatformForm />
      </div>

      <PlatformTable data={data} />
    </div>
  );
}
