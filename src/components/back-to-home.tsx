"use client"

import { useAppSelector } from '@/lib/hooks'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const BackToHome = () => {
    const currentUser = useAppSelector(state => state.users.currentUser);
    if (currentUser?.role.name !== 'player') {
        return null
    }
    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            <Link
                href="/"
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
            </Link>
        </div>
    )
}

export default BackToHome