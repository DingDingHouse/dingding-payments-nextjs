"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { WalletForm } from "./wallet-form";
import { WalletType } from "@/lib/types";

export function SelectWalletCreator({
  walletTypes,
  walletTypeId,
}: {
  walletTypes: WalletType[];
  walletTypeId: String;
}) {
  const groupedWalletTypes = Object.values(
    walletTypes?.reduce((acc: any, walletType: any) => {
      const createdById = walletType.createdBy?._id || "unknown";
      if (!acc[createdById]) {
        acc[createdById] = {
          creator: walletType.createdBy,
          types: [],
        };
      }
      acc[createdById].types.push(walletType);
      return acc;
    }, {}) || {}
  ) as any;
  const selUser = groupedWalletTypes.find((group: any) =>
    group.types.some((type: WalletType) => type._id === walletTypeId)
  ) as any;
  const [selectedUser, setSelectedUser] = useState(selUser.creator._id);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 mb-6">
        {groupedWalletTypes.map((group: any) => (
          <Button
            key={group.creator._id}
            onClick={() => setSelectedUser(group.creator._id)}
            variant={selectedUser === group.creator._id ? "default" : "outline"}
          >
            {group.creator.name}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {selectedUser && (
              <>
                {groupedWalletTypes
                  .find((group: any) => group.creator._id === selectedUser)
                  .types.map((walletType: any) => (
                    <Link
                      key={walletType._id}
                      href={`/wallets/${walletType._id}`}
                      className={`flex gap-2 items-center p-2 rounded-md border cursor-pointer transition-all ${
                        walletType._id === walletTypeId
                          ? "bg-white text-black border-primary"
                          : "border hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={walletType.logo}
                        alt="Logo"
                        width={28}
                        height={28}
                      />
                      {walletType.name}
                    </Link>
                  ))}
              </>
            )}
          </div>
        </div>
        <WalletForm />
      </div>
    </div>
  );
}
