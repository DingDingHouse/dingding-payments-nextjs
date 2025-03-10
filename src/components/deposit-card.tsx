"use client"
import { useAppSelector } from '@/lib/hooks'
import { Coins } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const DepositCard = () => {
    const currentUser = useAppSelector(state => state.users.currentUser)
    return (
        <div className="bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[#2C73D2]/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-[#F9C80E] to-[#F86624] rounded-full shadow-lg">
                    <Coins className="h-7 w-7 text-[#050A30]" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
                    <p className="text-[#8EACCD]">Boost your gaming balance</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-[#0A1149] rounded-lg p-4 border border-[#2C73D2]/20">
                    <div className="flex justify-between items-center">
                        <p className="text-[#8EACCD]">Current Balance</p>
                        <p className="text-[#F9C80E] font-bold">${currentUser?.credits}</p>
                    </div>
                </div>

                <div className="text-center">
                    <div className="relative inline-block">
                        <Link
                            href="/requests"
                            className="relative z-10 bg-gradient-to-r from-[#F9C80E] to-[#F86624] text-[#050A30] font-bold py-3 px-8 rounded-full hover:shadow-[0_0_20px_rgba(249,200,14,0.5)] transition-all inline-block"
                        >
                            GET STARTED
                        </Link>
                        <div className="absolute top-0 left-0 w-full h-full bg-white blur-md opacity-30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DepositCard