import getCookie from "@/lib/getCookie";
import { BannerQuery, Roles } from "@/lib/types";
import { decodeToken } from "@/lib/utils";
import { getAllBanners } from "./actions";
import BackToHome from "@/components/back-to-home";
import BannerTable from "@/components/banner-table";
import { BannerForm } from "@/components/banner-form";

export const dynamic = "force-dynamic";

export default async function BannerPage(props: {
  searchParams?: Promise<{
    search?: string;
    isActive?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const filters: BannerQuery = {
    search: searchParams?.search,
    isActive: searchParams?.isActive as "true" | "false",
  };

  const cookie = await getCookie("accessToken");
  const decodedToken = cookie ? decodeToken(cookie) : null;
  const isPlayer = decodedToken?.role === Roles.PLAYER;

  const { data } = await getAllBanners(filters);

  return (
    <div className="p-4 sm:p-10">
      <BackToHome isPlayer={isPlayer} />

      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <BannerForm />
      </div>

      <BannerTable data={data} />
    </div>
  );
}
