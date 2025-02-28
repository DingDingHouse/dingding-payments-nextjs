"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
    totalItems: number
    currentPage: number
    pageSize: number
    className?: string
}

export function Pagination({
    totalItems,
    currentPage,
    pageSize,
    className
}: PaginationProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const totalPages = Math.ceil(totalItems / pageSize)

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {currentPage > 1 ? (
                <Button
                    variant="outline"
                    size="icon"
                    asChild
                >
                    <Link href={createPageURL(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    disabled
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}
            <div className="text-sm">
                Page {currentPage} of {totalPages}
            </div>

            {currentPage < totalPages ? (
                <Button
                    variant="outline"
                    size="icon"
                    asChild
                >
                    <Link href={createPageURL(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    disabled
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}