'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/lib/redux/features/userSlice'
import { AppSidebar } from './app-sidebar'

interface UserProviderProps {
    initialUser: {
        _id: string
        name: string
        username: string
        role: {
            _id: string
            name: string
            status: string
            descendants: string[]
            createdAt: string
            updatedAt: string
            __v: number
        }
        status: string
        permissions: Array<{
            resource: string
            permission: string
        }>
    }
}

export function UserProvider({ initialUser }: UserProviderProps) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setUser(initialUser))
    }, [dispatch, initialUser])

    return <AppSidebar user={initialUser} />
}